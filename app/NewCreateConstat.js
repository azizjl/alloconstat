import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Linking } from 'react-native';
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
import CircumstancesStep from './components/newconstat/CircumstancesStep';
import SketchStep from './components/newconstat/SketchStep';
import ReviewStep from './components/newconstat/ReviewStep';
import FinalStep from './components/newconstat/FinalStep';
import { useConstatStore } from '../store/constatStore';

export default function NewCreateConstat() {
  const { user } = useAuthStore();
  const constatState = useConstatStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [processingDocuments, setProcessingDocuments] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
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
    // This function is now only used for the final "Return to Home" button
    router.back();
  };
  
  const handleSubmissionComplete = () => {
    setIsSubmitted(true);
  };
  
  const nextStep = () => {
    if (currentStep === 1 && !constatState.vehicleCount) {
      Alert.alert('Erreur', 'Veuillez sélectionner le nombre de véhicules impliqués');
      return;
    }
    
    const maxStep = constatState.vehicleCount === 1 ? 9 : 12;
    
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
    const maxSteps = constatState.vehicleCount === 1 ? 9 : 12;
    
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
  
  // Render the thank you page after submission
  const renderThankYouPage = () => {
    return (
      <ScrollView style={tw`flex-1 p-6`}>
        <View style={tw`items-center mb-8 mt-4`}>
          <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
          <Text style={tw`text-2xl font-[OutfitB] text-center mt-4 text-gray-800`}>
            Merci pour votre soumission!
          </Text>
        </View>
        
        <Text style={tw`text-lg font-[OutfitM] text-center mb-6 text-gray-700`}>
          Votre constat a été enregistré avec succès. Un de nos agents vous contactera prochainement pour le suivi.
        </Text>
        
        <Text style={tw`text-base font-[OutfitM] mb-8 text-gray-600`}>
          En attendant, veuillez rester en sécurité et prendre toutes les précautions nécessaires. Si vous avez besoin d'assistance immédiate, vous pouvez contacter les services d'urgence ci-dessous.
        </Text>
        
        <View style={tw`mb-8`}>
          <Text style={tw`text-lg font-[OutfitB] mb-4 text-gray-800`}>
            Services d'urgence
          </Text>
          
          <TouchableOpacity
            style={tw`bg-red-500 py-3 px-5 rounded-lg flex-row items-center mb-4`}
            onPress={() => Linking.openURL('tel:190')}
          >
            <Ionicons name="call" size={20} color="white" style={tw`mr-2`} />
            <Text style={tw`text-white font-[OutfitM]`}>Police (190)</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={tw`bg-red-500 py-3 px-5 rounded-lg flex-row items-center mb-4`}
            onPress={() => Linking.openURL('tel:198')}
          >
            <Ionicons name="medkit" size={20} color="white" style={tw`mr-2`} />
            <Text style={tw`text-white font-[OutfitM]`}>Ambulance (198)</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={tw`bg-red-500 py-3 px-5 rounded-lg flex-row items-center mb-4`}
            onPress={() => Linking.openURL('tel:197')}
          >
            <Ionicons name="flame" size={20} color="white" style={tw`mr-2`} />
            <Text style={tw`text-white font-[OutfitM]`}>Pompiers (197)</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={tw`bg-[#0a7ea4] py-3 px-5 rounded-lg flex-row items-center mb-4`}
            onPress={() => Linking.openURL('tel:+21671000000')} // Replace with your company's number
          >
            <Ionicons name="car" size={20} color="white" style={tw`mr-2`} />
            <Text style={tw`text-white font-[OutfitM]`}>Assistance routière</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={tw`bg-green-600 py-3 px-5 rounded-lg flex-row items-center justify-center mb-8`}
          onPress={handleSubmit}
        >
          <Ionicons name="home" size={20} color="white" style={tw`mr-2`} />
          <Text style={tw`text-white font-[OutfitM]`}>Retour à l'accueil</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };
  
  const renderCurrentStep = () => {
    if (isSubmitted) {
      return renderThankYouPage();
    }
    
    switch (currentStep) {
      case 1:
        return <VehicleCountStep />;
      case 2:
        return <AccidentInfoStep />;
      case 3:
        return (
          <DocumentScanStep 
            vehicle="A"
            onProcess={() => processDocuments('A')}
            processing={processingDocuments}
          />
        );
      case 4:
        return <VehicleInfoStep isVehicleA={true} />;
      case 5:
        return <DamagesStep isVehicleA={true} />;
      case 6:
        if (constatState.vehicleCount === 1) {
          return <CircumstancesStep isVehicleA={true} />;
        }
        return (
          <DocumentScanStep 
            vehicle="B"
            onProcess={() => processDocuments('B')}
            processing={processingDocuments}
          />
        );
      case 7:
        if (constatState.vehicleCount === 1) {
          return <SketchStep />;
        }
        return <VehicleInfoStep isVehicleA={false} />;
      case 8:
        if (constatState.vehicleCount === 1) {
          return <ReviewStep />;
        }
        return <DamagesStep isVehicleA={false} />;
      case 9:
        if (constatState.vehicleCount === 1) {
          return <FinalStep onSubmissionComplete={handleSubmissionComplete} />;
        }
        return <CircumstancesStep isVehicleA={false} />;
      case 10:
        return <SketchStep />;
      case 11:
        return <ReviewStep />;
      case 12:
        return <FinalStep onSubmissionComplete={handleSubmissionComplete} />;
      default:
        return null;
    }
  };
  
  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <View style={tw`flex-row items-center p-4 border-b border-gray-200 bg-white`}>
        {!isSubmitted && (
          <TouchableOpacity onPress={prevStep}>
            <Ionicons name="arrow-back" size={24} color="#0a7ea4" />
          </TouchableOpacity>
        )}
        <Text style={[tw`flex-1 text-center text-lg text-gray-800`,{fontFamily:'OutfitB'}]}>
          {isSubmitted ? "Confirmation" : "Nouveau Constat"}
        </Text>
        <View style={tw`w-6`}></View>
      </View>
      
      {!isSubmitted && renderStepIndicator()}
      
      <View style={tw`flex-1 px-4`} showsVerticalScrollIndicator={false}>
        {renderCurrentStep()}
      </View>
      
      {!isSubmitted && (
        <View style={tw`p-4 bg-white border-t border-gray-200`}>
          {((currentStep === 9 && constatState.vehicleCount === 1) || (currentStep === 12 && constatState.vehicleCount === 2)) ? (
            <TouchableOpacity 
              style={tw`bg-[#0a7ea4] p-4 rounded-full flex-row justify-center items-center opacity-50`}
              disabled={true}
            >
              <Text style={[tw`text-white font-[OutfitM] text-lg`,{fontFamily:'OutfitB'}]}>Enregistrer</Text>
              <Ionicons name="checkmark" size={20} color="white" style={tw`ml-2`} />
            </TouchableOpacity>
          ) : ((currentStep === 8 && constatState.vehicleCount === 1) || (currentStep === 11 && constatState.vehicleCount === 2)) ? (
            <TouchableOpacity 
              style={tw`bg-[#0a7ea4] p-4 rounded-full flex-row justify-center items-center`}
              onPress={nextStep}
            >
              <Text style={[tw`text-white font-[OutfitM] text-lg`,{fontFamily:'OutfitB'}]}>Continuer vers la signature</Text>
              <Ionicons name="arrow-forward" size={20} color="white" style={tw`ml-2`} />
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
                  <Text style={[tw`text-white font-[OutfitM] text-lg`,{fontFamily:'OutfitB'}]}>Suivant</Text>
                  <Ionicons name="arrow-forward" size={20} color="white" style={tw`ml-2`} />
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}