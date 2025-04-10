import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Dimensions, Image, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { useConstatStore } from '../../../store/constatStore';
import { Canvas, Path, useCanvasRef } from '@shopify/react-native-skia';
import ViewShot from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../../../lib/supabase';

export default function FinalStep({ onSubmissionComplete }) {
  const constatState = useConstatStore();
  const canvasRef = useCanvasRef();
  const viewShotRef = useRef();
  const scrollViewRef = useRef();
  
  const [paths, setPaths] = useState([]);
  const [currentPoints, setCurrentPoints] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureA, setSignatureA] = useState(null);
  const [signatureB, setSignatureB] = useState(null);
  const [currentSignature, setCurrentSignature] = useState('A'); // 'A' or 'B'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('https://gateway.konnect.network/pay?payment_ref=67f73411ababd2cf9f72f8f5'); // Replace with your actual payment URL
  
  // Get screen dimensions
  const { width } = Dimensions.get('window');
  const canvasWidth = width - 32; // Full width minus padding
  const canvasHeight = 150; // Height for signature
  
  // Handle touch start
  const onTouchStart = (event) => {
    setIsDrawing(true);
    const { locationX, locationY } = event.nativeEvent;
    setCurrentPoints([{ x: locationX, y: locationY }]);
    
    // Disable scroll when drawing starts
    if (scrollViewRef.current) {
      scrollViewRef.current.setNativeProps({ scrollEnabled: false });
    }
  };
  
  // Handle touch move
  const onTouchMove = (event) => {
    if (!isDrawing) return;
    
    const { locationX, locationY } = event.nativeEvent;
    setCurrentPoints(prevPoints => [...prevPoints, { x: locationX, y: locationY }]);
  };
  
  // Handle touch end
  const onTouchEnd = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    
    // Re-enable scroll when drawing ends
    if (scrollViewRef.current) {
      scrollViewRef.current.setNativeProps({ scrollEnabled: true });
    }
    
    if (currentPoints.length < 2) {
      setCurrentPoints([]);
      return;
    }
    
    // Create SVG path from points
    let pathData = '';
    currentPoints.forEach((point, index) => {
      if (index === 0) {
        pathData = `M ${point.x} ${point.y}`;
      } else {
        pathData = `${pathData} L ${point.x} ${point.y}`;
      }
    });
    
    // Add the new path to paths array
    setPaths([...paths, { 
      path: pathData,
      color: '#000000',
      strokeWidth: 2
    }]);
    
    // Clear current points
    setCurrentPoints([]);
  };
  
  // Handle touch cancel
  const onTouchCancel = () => {
    setIsDrawing(false);
    setCurrentPoints([]);
    
    // Re-enable scroll when touch is cancelled
    if (scrollViewRef.current) {
      scrollViewRef.current.setNativeProps({ scrollEnabled: true });
    }
  };
  
  // Clear the signature
  const clearSignature = () => {
    setPaths([]);
    setCurrentPoints([]);
  };
  
  // Save the signature
  const saveSignature = async () => {
    try {
      if (viewShotRef.current && paths.length > 0) {
        const uri = await viewShotRef.current.capture();
        
        // Convert to base64
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        // Save to appropriate signature state
        if (currentSignature === 'A') {
          setSignatureA({ uri, base64 });
          constatState.setSignatureA({ uri, base64 });
          Alert.alert("Succès", "Signature du conducteur A enregistrée");
          
          // If we have vehicle B, switch to it
          if (constatState.vehicleCount === 2) {
            setCurrentSignature('B');
            clearSignature();
          }
        } else {
          setSignatureB({ uri, base64 });
          constatState.setSignatureB({ uri, base64 });
          Alert.alert("Succès", "Signature du conducteur B enregistrée");
        }
      } else {
        Alert.alert("Erreur", "Veuillez signer avant d'enregistrer");
      }
    } catch (error) {
      console.error("Error saving signature:", error);
      Alert.alert("Erreur", "Impossible d'enregistrer la signature");
    }
  };
  
  // Create a path from current points for live drawing
  const getCurrentPath = () => {
    if (currentPoints.length < 2) return null;
    
    let pathData = '';
    currentPoints.forEach((point, index) => {
      if (index === 0) {
        pathData = `M ${point.x} ${point.y}`;
      } else {
        pathData = `${pathData} L ${point.x} ${point.y}`;
      }
    });
    
    return pathData;
  };
  
  // Open payment page in browser
  const openPaymentPage = () => {
    Linking.openURL(paymentUrl);
  };
  
  // Submit constat to database
  const submitConstat = async () => {
    // Check if we have all required signatures
    if (!signatureA || (constatState.vehicleCount === 2 && !signatureB)) {
      Alert.alert("Erreur", "Veuillez signer le constat avant de soumettre");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // Prepare data for submission
      const constatData = {
        user_id: user.id,
        title: constatState.title || 'Constat sans titre',
        // Format dates properly or use null for empty values
        accident_date: constatState.accidentDate ? new Date(constatState.accidentDate).toISOString().split('T')[0] : null,
        accident_time: constatState.accidentTime || null,
        accident_location: constatState.accidentLocation || null,
        has_injuries: constatState.hasInjuries || false,
        has_material_damage: constatState.hasMaterialDamage || false,
        witnesses: constatState.witnesses || null,
        vehicle_count: constatState.vehicleCount || 1,
        
        // Vehicle A data
        vehicle_a_insurance: constatState.vehicleAInsurance || null,
        vehicle_a_insurance_policy: constatState.vehicleAInsurancePolicy || null,
        vehicle_a_agency: constatState.vehicleAAgency || null,
        vehicle_a_certificate_valid_from: constatState.vehicleACertificateValidFrom ? 
          new Date(constatState.vehicleACertificateValidFrom).toISOString().split('T')[0] : null,
        vehicle_a_certificate_valid_to: constatState.vehicleACertificateValidTo ? 
          new Date(constatState.vehicleACertificateValidTo).toISOString().split('T')[0] : null,
        driver_a_name: constatState.driverAName || null,
        driver_a_first_name: constatState.driverAFirstName || null,
        driver_a_address: constatState.driverAAddress || null,
        driver_a_phone: constatState.driverAPhone || null,
        driver_a_license: constatState.driverALicense || null,
        driver_a_license_date: constatState.driverALicenseDate ? 
          new Date(constatState.driverALicenseDate).toISOString().split('T')[0] : null,
        insured_a_name: constatState.insuredAName || null,
        insured_a_first_name: constatState.insuredAFirstName || null,
        insured_a_address: constatState.insuredAAddress || null,
        insured_a_phone: constatState.insuredAPhone || null,
        vehicle_a_make: constatState.vehicleAMake || null,
        vehicle_a_model: constatState.vehicleAModel || null,
        vehicle_a_plate: constatState.vehicleAPlate || null,
        vehicle_a_direction: constatState.vehicleADirection || null,
        vehicle_a_from: constatState.vehicleAFrom || null,
        vehicle_a_to: constatState.vehicleATo || null,
        vehicle_a_damages: constatState.vehicleADamages || null,
        vehicle_a_circumstances: constatState.vehicleACircumstances || null,
        vehicle_a_observations: constatState.vehicleAObservations || null,
        vehicle_a_impact_points: constatState.vehicleAImpactPoints || null,
        vehicle_a_image: signatureA?.base64 || null,
        signature_a: signatureA?.base64 || null,
        
        // Vehicle B data (if applicable)
        ...(constatState.vehicleCount === 2 && {
          vehicle_b_insurance: constatState.vehicleBInsurance || null,
          vehicle_b_insurance_policy: constatState.vehicleBInsurancePolicy || null,
          vehicle_b_agency: constatState.vehicleBAgency || null,
          vehicle_b_certificate_valid_from: constatState.vehicleBCertificateValidFrom ? 
            new Date(constatState.vehicleBCertificateValidFrom).toISOString().split('T')[0] : null,
          vehicle_b_certificate_valid_to: constatState.vehicleBCertificateValidTo ? 
            new Date(constatState.vehicleBCertificateValidTo).toISOString().split('T')[0] : null,
          driver_b_name: constatState.driverBName || null,
          driver_b_first_name: constatState.driverBFirstName || null,
          driver_b_address: constatState.driverBAddress || null,
          driver_b_phone: constatState.driverBPhone || null,
          driver_b_license: constatState.driverBLicense || null,
          driver_b_license_date: constatState.driverBLicenseDate ? 
            new Date(constatState.driverBLicenseDate).toISOString().split('T')[0] : null,
          insured_b_name: constatState.insuredBName || null,
          insured_b_first_name: constatState.insuredBFirstName || null,
          insured_b_address: constatState.insuredBAddress || null,
          insured_b_phone: constatState.insuredBPhone || null,
          vehicle_b_make: constatState.vehicleBMake || null,
          vehicle_b_model: constatState.vehicleBModel || null,
          vehicle_b_plate: constatState.vehicleBPlate || null,
          vehicle_b_direction: constatState.vehicleBDirection || null,
          vehicle_b_from: constatState.vehicleBFrom || null,
          vehicle_b_to: constatState.vehicleBTo || null,
          vehicle_b_damages: constatState.vehicleBDamages || null,
          vehicle_b_circumstances: constatState.vehicleBCircumstances || null,
          vehicle_b_observations: constatState.vehicleBObservations || null,
          vehicle_b_impact_points: constatState.vehicleBImpactPoints || null,
          vehicle_b_image: constatState.vehicleBImage?.base64 || null,
          signature_b: signatureB?.base64 || null,
        }),
        
        // Sketch data
        sketch_template: constatState.sketchTemplate ? JSON.stringify(constatState.sketchTemplate) : null,
        sketch_image: constatState.sketchImage?.base64 || null,
        
        // Metadata
        created_at: new Date().toISOString(),
        status: 'submitted',
      };
      
      console.log("Submitting constat data:", JSON.stringify(constatData, null, 2));
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('constats')
        .insert([constatData])
        .select();
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      // Set submission as complete
      setIsSubmitted(true);
      
      // Notify parent component that submission is complete
      if (onSubmissionComplete) {
        onSubmissionComplete();
      }
      
      // Success!
      Alert.alert(
        "Succès",
        "Votre constat a été soumis avec succès!",
        [
          { 
            text: "OK", 
            onPress: () => {
              // Reset the store
              constatState.resetState();
            } 
          }
        ]
      );
      
    } catch (error) {
      console.error("Error submitting constat:", error);
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la soumission du constat. Veuillez réessayer."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <ScrollView 
      ref={scrollViewRef}
      style={tw`bg-white rounded-lg shadow-sm`} 
      contentContainerStyle={tw`p-6`}
      scrollEnabled={!isDrawing}
    >
      <Text style={[tw`text-xl font-[OutfitB] mb-6 text-center`,{fontFamily:'OutfitB'}]}>
        Finalisation du constat
      </Text>
      
      {/* Signature section */}
      <View style={tw`mb-6`}>
        <Text style={[tw`text-lg font-[OutfitB] text-gray-800 mb-4`,{fontFamily:'OutfitB'}]}>
          Signature{constatState.vehicleCount === 2 ? 's' : ''}
        </Text>
        
        {/* Signature A */}
        <View style={tw`mb-6`}>
          <View style={tw`flex-row items-center mb-2`}>
            <View style={tw`h-6 w-6 rounded-full bg-yellow-500 items-center justify-center mr-2`}>
              <Text style={[tw`text-white font-[OutfitB] text-xs`,{fontFamily:'OutfitB'}]}>A</Text>
            </View>
            <Text style={[tw`text-base font-[OutfitM] text-gray-800`,{fontFamily:'OutfitB'}]}>
              Signature du conducteur A
            </Text>
          </View>
          
          {signatureA ? (
            <View style={tw`border-2 border-gray-300 rounded-lg overflow-hidden bg-white p-2`}>
              <Image 
                source={{ uri: signatureA.uri }} 
                style={tw`w-full h-20`}
                resizeMode="contain"
              />
              <TouchableOpacity
                style={tw`bg-gray-200 py-2 px-4 rounded-lg self-end mt-2`}
                onPress={() => {
                  setSignatureA(null);
                  setCurrentSignature('A');
                  clearSignature();
                }}
              >
                <Text style={tw`text-gray-700`}>Refaire</Text>
              </TouchableOpacity>
            </View>
          ) : currentSignature === 'A' ? (
            <View style={tw`mb-4`}>
              <Text style={tw`text-gray-600 mb-2`}>
                Veuillez signer ci-dessous:
              </Text>
              
              <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.9 }}>
                <View 
                  style={tw`w-full h-${canvasHeight/4} border-2 border-gray-300 rounded-lg overflow-hidden bg-white`}
                >
                  <Canvas style={tw`flex-1`} ref={canvasRef}>
                    {paths.map((p, index) => (
                      <Path
                        key={index}
                        path={p.path}
                        color={p.color}
                        style="stroke"
                        strokeWidth={p.strokeWidth}
                      />
                    ))}
                    
                    {currentPoints.length > 1 && (
                      <Path
                        path={getCurrentPath()}
                        color="#000000"
                        style="stroke"
                        strokeWidth={2}
                      />
                    )}
                  </Canvas>
                  
                  {/* Transparent overlay for touch events */}
                  <View 
                    style={tw`absolute top-0 left-0 right-0 bottom-0`}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    onTouchCancel={onTouchCancel}
                  />
                </View>
              </ViewShot>
              
              <View style={tw`flex-row justify-between mt-2`}>
                <TouchableOpacity
                  style={tw`bg-gray-200 py-2 px-4 rounded-lg`}
                  onPress={clearSignature}
                >
                  <Text style={tw`text-gray-700`}>Effacer</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={tw`bg-[#0a7ea4] py-2 px-4 rounded-lg`}
                  onPress={saveSignature}
                >
                  <Text style={tw`text-white`}>Enregistrer</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </View>
        
        {/* Signature B (if applicable) */}
        {constatState.vehicleCount === 2 && (
          <View style={tw`mb-6`}>
            <View style={tw`flex-row items-center mb-2`}>
              <View style={tw`h-6 w-6 rounded-full bg-green-500 items-center justify-center mr-2`}>
                <Text style={[tw`text-white font-[OutfitB] text-xs`,{fontFamily:'OutfitB'}]     }>B</Text>
              </View>
              <Text style={[tw`text-base font-[OutfitM] text-gray-800`,{fontFamily:'OutfitB'}]}>
                Signature du conducteur B
              </Text>
            </View>
            
            {signatureB ? (
              <View style={tw`border-2 border-gray-300 rounded-lg overflow-hidden bg-white p-2`}>
                <Image 
                  source={{ uri: signatureB.uri }} 
                  style={tw`w-full h-20`}
                  resizeMode="contain"
                />
                <TouchableOpacity
                  style={tw`bg-gray-200 py-2 px-4 rounded-lg self-end mt-2`}
                  onPress={() => {
                    setSignatureB(null);
                    setCurrentSignature('B');
                    clearSignature();
                  }}
                >
                  <Text style={tw`text-gray-700`}>Refaire</Text>
                </TouchableOpacity>
              </View>
            ) : currentSignature === 'B' ? (
              <View style={tw`mb-4`}>
                <Text style={tw`text-gray-600 mb-2`}>
                  Veuillez signer ci-dessous:
                </Text>
                
                <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.9 }}>
                  <View 
                    style={tw`w-full h-${canvasHeight/4} border-2 border-gray-300 rounded-lg overflow-hidden bg-white`}
                  >
                    <Canvas style={tw`flex-1`} ref={canvasRef}>
                      {paths.map((p, index) => (
                        <Path
                          key={index}
                          path={p.path}
                          color={p.color}
                          style="stroke"
                          strokeWidth={p.strokeWidth}
                        />
                      ))}
                      
                      {currentPoints.length > 1 && (
                        <Path
                          path={getCurrentPath()}
                          color="#000000"
                          style="stroke"
                          strokeWidth={2}
                        />
                      )}
                    </Canvas>
                    
                    {/* Transparent overlay for touch events */}
                    <View 
                      style={tw`absolute top-0 left-0 right-0 bottom-0`}
                      onTouchStart={onTouchStart}
                      onTouchMove={onTouchMove}
                      onTouchEnd={onTouchEnd}
                      onTouchCancel={onTouchCancel}
                    />
                  </View>
                </ViewShot>
                
                <View style={tw`flex-row justify-between mt-2`}>
                  <TouchableOpacity
                    style={tw`bg-gray-200 py-2 px-4 rounded-lg`}
                    onPress={clearSignature}
                  >
                    <Text style={tw`text-gray-700`}>Effacer</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={tw`bg-[#0a7ea4] py-2 px-4 rounded-lg`}
                    onPress={saveSignature}
                  >
                    <Text style={tw`text-white`}>Enregistrer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
          </View>
        )}
      </View>
      
      {/* Payment section */}
      <View style={tw`mb-6`}>
        <Text style={[tw`text-lg font-[OutfitB] text-gray-800 mb-4`,{fontFamily:'OutfitB'}]}>
          Paiement
        </Text>
        
        <Text style={[tw`text-gray-600 mb-4`,{fontFamily:'OutfitB'}]}>
          Pour finaliser votre constat, un paiement de 23,800 DT est requis. Ce paiement couvre les frais de traitement et d'envoi du constat à votre assurance.
        </Text>
        
        <TouchableOpacity
          style={tw`bg-[#0a7ea4] py-3 px-5 rounded-lg flex-row items-center justify-center mb-4`}
          onPress={openPaymentPage}
        >
          <Ionicons name="card-outline" size={20} color="white" style={tw`mr-2`} />
          <Text style={[tw`text-white font-[OutfitM]`,{fontFamily:'OutfitB'}]}>Procéder au paiement</Text>
        </TouchableOpacity>
      </View>
      
      {/* Submit button */}
      <TouchableOpacity
        style={[
          tw`py-3 px-5 rounded-lg flex-row items-center justify-center mb-8`,
          isSubmitting ? tw`bg-gray-400` : tw`bg-green-600`
        ]}
        onPress={submitConstat}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
                <Text style={[tw`text-white font-[OutfitM]`,{fontFamily:'OutfitB'}]}>Soumission en cours...</Text>
        ) : (
          <>
            <Ionicons name="checkmark-circle" size={20} color="white" style={tw`mr-2`} />
            <Text style={[tw`text-white font-[OutfitM]`,{fontFamily:'OutfitB'}]}>Soumettre le constat</Text>
          </>
        )}
      </TouchableOpacity>
      
      <Text style={[tw`text-gray-500 text-center mt-4 font-[OutfitR] pb-10`,{fontFamily:'OutfitB'}]}>
        En soumettant ce constat, vous certifiez que toutes les informations fournies sont exactes.
      </Text>
    </ScrollView>
  );
} 