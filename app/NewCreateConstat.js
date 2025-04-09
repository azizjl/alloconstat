import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { decode } from 'base64-arraybuffer';

// Import step components
import VehicleCountStep from './components/newconstat/VehicleCountStep';
import DocumentScanStep from './components/newconstat/DocumentScanStep';
import AccidentInfoStep from './components/newconstat/AccidentInfoStep';
import VehicleInfoStep from './components/newconstat/VehicleInfoStep';
import DriverInfoStep from './components/newconstat/DriverInfoStep';
import DamagesStep from './components/newconstat/DamagesStep';
import SketchStep from './components/newconstat/SketchStep';
import ReviewStep from './components/newconstat/ReviewStep';
import { useConstatStore } from '../store/constatStore';

export default function NewCreateConstat() {
  const { user } = useAuthStore();
  const constatState = useConstatStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [processingDocuments, setProcessingDocuments] = useState(false);
  
  // Process documents with Google Vision API
  const processDocuments = async (vehicle) => {
    setProcessingDocuments(true);
    try {
      // This would be where you'd call your backend API that interfaces with Google Vision
      // For now, we'll simulate a response
      
      if (vehicle === 'A') {
        // Simulate processing ID card
        // if (constatState.vehicleAIdCard) {
        //   // In a real implementation, you would send the image to your backend
        //   // which would then use Google Vision API to extract text
          
        //   // Simulate a delay
        //   await new Promise(resolve => setTimeout(resolve, 1500));
          
        //   // Simulate extracted data
        //   constatState.setDriverAName('Dupont');
        //   constatState.setDriverAFirstName('Jean');
        //   constatState.setDriverAAddress('123 Rue de Paris, 75001 Paris');
        // }
        
        // // Simulate processing vehicle registration
        // if (constatState.vehicleARegistration) {
        //   await new Promise(resolve => setTimeout(resolve, 1500));
          
        //   constatState.setVehicleAMake('Renault');
        //   constatState.setVehicleAModel('Clio');
        //   constatState.setVehicleAPlate('AB-123-CD');
        // }
        
        // // Simulate processing insurance card
        // if (constatState.vehicleAInsuranceCard) {
        //   await new Promise(resolve => setTimeout(resolve, 1500));
          
        //   constatState.setVehicleAInsurance('AXA Assurances');
        //   constatState.setVehicleAInsurancePolicy('POL123456789');
        //   constatState.setVehicleAAgency('Paris Centre');
        //   constatState.setVehicleACertificateValidFrom('01/01/2023');
        //   constatState.setVehicleACertificateValidTo('31/12/2023');
        // }
      } else if (vehicle === 'B' && constatState.vehicleCount === 2) {
        // Similar processing for vehicle B
        // Simulate processing ID card
        // if (constatState.vehicleBIdCard) {
        //   await new Promise(resolve => setTimeout(resolve, 1500));
          
        //   constatState.setDriverBName('Martin');
        //   constatState.setDriverBFirstName('Sophie');
        //   constatState.setDriverBAddress('456 Avenue des Champs, 75008 Paris');
        // }
        
        // Simulate processing vehicle registration
        // if (constatState.vehicleBRegistration) {
        //   await new Promise(resolve => setTimeout(resolve, 1500));
          
        //   constatState.setVehicleBMake('Peugeot');
        //   constatState.setVehicleBModel('308');
        //   constatState.setVehicleBPlate('EF-456-GH');
        // }
        
        // Simulate processing insurance card
        // if (constatState.vehicleBInsuranceCard) {
        //   await new Promise(resolve => setTimeout(resolve, 1500));
          
        //   constatState.setVehicleBInsurance('MAIF');
        //   constatState.setVehicleBInsurancePolicy('POL987654321');
        //   constatState.setVehicleBAgency('Paris Sud');
        //   constatState.setVehicleBCertificateValidFrom('01/03/2023');
        //   constatState.setVehicleBCertificateValidTo('28/02/2024');
        // }
      }
      
      Alert.alert('Succès', 'Documents traités avec succès');
      nextStep();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de traiter les documents: ' + error.message);
    } finally {
      setProcessingDocuments(false);
    }
  };
  
  // Upload image to storage
  const uploadImage = async (image, path) => {
    if (!image) return null;
    
    try {
      // Handle both camera images and canvas sketches
      const base64Data = image.base64;
      if (!base64Data) return null;
      
      const { data, error } = await supabase.storage
        .from('constat-images')
        .upload(path, decode(base64Data), {
          contentType: 'image/png',
        });
        
      if (error) throw error;
      
      return data.path;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };
  
  const handleSubmit = async () => {
    if (!constatState.title.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un titre pour ce constat');
      return;
    }
    
    try {
      setLoading(true);
      
      // Upload all images
      const uploadPromises = [];
      let uploadResults = {};
      
      // Vehicle A images
      if (constatState.vehicleAImage) {
        uploadPromises.push(
          uploadImage(constatState.vehicleAImage, `${user.id}/${Date.now()}-vehicleA.jpg`)
            .then(path => { uploadResults.vehicleAImagePath = path; })
        );
      }
      
      if (constatState.vehicleAIdCard) {
        uploadPromises.push(
          uploadImage(constatState.vehicleAIdCard, `${user.id}/${Date.now()}-vehicleA-id.jpg`)
            .then(path => { uploadResults.vehicleAIdCardPath = path; })
        );
      }
      
      // Add other image uploads similarly
      // ...
      
      // Wait for all uploads to complete
      await Promise.all(uploadPromises);
      
      const { data, error } = await supabase
        .from('constats')
        .insert([
          { 
            title: constatState.title, 
            accident_date: constatState.accidentDate,
            accident_time: constatState.accidentTime,
            accident_location: constatState.accidentLocation,
            has_injuries: constatState.hasInjuries,
            has_material_damage: constatState.hasMaterialDamage,
            witnesses: constatState.witnesses,
            vehicle_count: constatState.vehicleCount,
            
            // Vehicle A
            vehicle_a_make: constatState.vehicleAMake,
            vehicle_a_model: constatState.vehicleAModel,
            vehicle_a_plate: constatState.vehicleAPlate,
            vehicle_a_insurance: constatState.vehicleAInsurance,
            vehicle_a_insurance_policy: constatState.vehicleAInsurancePolicy,
            vehicle_a_agency: constatState.vehicleAAgency,
            vehicle_a_certificate_valid_from: constatState.vehicleACertificateValidFrom,
            vehicle_a_certificate_valid_to: constatState.vehicleACertificateValidTo,
            vehicle_a_damages: constatState.vehicleADamages,
            vehicle_a_direction: constatState.vehicleADirection,
            vehicle_a_from: constatState.vehicleAFrom,
            vehicle_a_to: constatState.vehicleATo,
            vehicle_a_observations: constatState.vehicleAObservations,
            vehicle_a_image: uploadResults.vehicleAImagePath,
            vehicle_a_id_card: uploadResults.vehicleAIdCardPath,
            vehicle_a_registration: uploadResults.vehicleARegistrationPath,
            vehicle_a_insurance_card: uploadResults.vehicleAInsuranceCardPath,
            
            // Driver A
            driver_a_name: constatState.driverAName,
            driver_a_first_name: constatState.driverAFirstName,
            driver_a_address: constatState.driverAAddress,
            driver_a_phone: constatState.driverAPhone,
            driver_a_license: constatState.driverALicense,
            driver_a_license_date: constatState.driverALicenseDate,
            
            // Add Vehicle B and Driver B data similarly
            // ...
            
            user_id: user.id 
          }
        ])
        .select();
        
      if (error) throw error;
      
      Alert.alert('Succès', 'Constat créé avec succès');
      router.back();
    } catch (error) {
      Alert.alert('Erreur lors de la création du constat', error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const nextStep = () => {
    if (currentStep === 1 && !constatState.vehicleCount) {
      Alert.alert('Erreur', 'Veuillez sélectionner le nombre de véhicules impliqués');
      return;
    }
    
    const maxStep = constatState.vehicleCount === 1 ? 7 : 9;
    
    if (currentStep < maxStep) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };
  
  const renderStepIndicator = () => {
    const maxSteps = constatState.vehicleCount === 1 ? 7 : 9;
    
    return (
      <View style={tw`flex-row justify-center my-4`}>
        {Array.from({ length: maxSteps }, (_, i) => i + 1).map(step => (
          <View 
            key={step}
            style={tw`h-2 w-2 rounded-full mx-1 ${currentStep >= step ? 'bg-[#0a7ea4]' : 'bg-gray-300'}`}
          />
        ))}
      </View>
    );
  };
  
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <VehicleCountStep />;
      case 2:
        return (
          <DocumentScanStep 
            vehicle="A"
            onProcess={() => processDocuments('A')}
            processing={processingDocuments}
          />
        );
      case 3:
        return <AccidentInfoStep />;
      case 4:
        return <VehicleInfoStep isVehicleA={true} />;
      case 5:
        if (constatState.vehicleCount === 1) {
          return <DamagesStep isVehicleA={true} />;
        }
        return (
          <DocumentScanStep 
            vehicle="B"
            onProcess={() => processDocuments('B')}
            processing={processingDocuments}
          />
        );
      case 6:
        if (constatState.vehicleCount === 1) {
          return <SketchStep />;
        }
        return <VehicleInfoStep isVehicleA={false} />;
      case 7:
        if (constatState.vehicleCount === 1) {
          return <ReviewStep />;
        }
        return <DamagesStep isVehicleA={false} />;
      case 8:
        return <SketchStep />;
      case 9:
        return <ReviewStep />;
      default:
        return null;
    }
  };
  
  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <View style={tw`flex-row items-center p-4 border-b border-gray-200 bg-white`}>
        <TouchableOpacity onPress={prevStep}>
          <Ionicons name="arrow-back" size={24} color="#0a7ea4" />
        </TouchableOpacity>
        <Text style={tw`flex-1 text-center text-lg font-[OutfitB] text-gray-800`}>Nouveau Constat</Text>
        <View style={tw`w-6`}></View>
      </View>
      
      {renderStepIndicator()}
      
      <View style={tw`flex-1 px-4`} showsVerticalScrollIndicator={false}>
        {renderCurrentStep()}
        {/* <View style={tw`h-24`}></View> */}
      </View>
      
      <View style={tw`p-4 bg-white border-t border-gray-200`}>
        {(currentStep === 7 && constatState.vehicleCount === 1) || (currentStep === 9 && constatState.vehicleCount === 2) ? (
          <TouchableOpacity 
            style={tw`bg-[#0a7ea4] p-4 rounded-full flex-row justify-center items-center`}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text style={tw`text-white font-[OutfitM] text-lg`}>Enregistrer</Text>
                <Ionicons name="checkmark" size={20} color="white" style={tw`ml-2`} />
              </>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={tw`bg-[#0a7ea4] p-4 rounded-full flex-row justify-center items-center`}
            onPress={nextStep}
            disabled={processingDocuments}
          >
            {processingDocuments ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text style={tw`text-white font-[OutfitM] text-lg`}>Suivant</Text>
                <Ionicons name="arrow-forward" size={20} color="white" style={tw`ml-2`} />
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
} 