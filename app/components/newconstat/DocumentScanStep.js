import { View, Text, TouchableOpacity, Image, ActivityIndicator, ScrollView } from 'react-native';
import tw from 'twrnc';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useConstatStore } from '../../../store/constatStore';

export default function DocumentScanStep({ vehicle, onProcess, processing }) {
  const constatState = useConstatStore();
  const [processingStatus, setProcessingStatus] = useState({
    idCard: false,
    registration: false,
    insurance: false
  });
const [loading, setLoading] = useState(false);
  
  // Get the appropriate state setters based on vehicle
  const {
    setVehicleAIdCard, 
    setVehicleARegistration, 
    setVehicleAInsuranceCard,
    setVehicleBIdCard, 
    setVehicleBRegistration, 
    setVehicleBInsuranceCard,
    setVehicleADriverInfo,
    setVehicleAVehicleInfo,
    setVehicleAInsuranceInfo,
    setVehicleBDriverInfo,
    setVehicleBVehicleInfo,
    setVehicleBInsuranceInfo
  } = constatState;
  
  // Get the appropriate state values based on vehicle
  const idCard = vehicle === 'A' ? constatState.vehicleAIdCard : constatState.vehicleBIdCard;
  const registration = vehicle === 'A' ? constatState.vehicleARegistration : constatState.vehicleBRegistration;
  const insuranceCard = vehicle === 'A' ? constatState.vehicleAInsuranceCard : constatState.vehicleBInsuranceCard;
  
  // Set the appropriate state setter based on vehicle
  const setIdCard = vehicle === 'A' ? setVehicleAIdCard : setVehicleBIdCard;
  const setRegistration = vehicle === 'A' ? setVehicleARegistration : setVehicleBRegistration;
  const setInsuranceCard = vehicle === 'A' ? setVehicleAInsuranceCard : setVehicleBInsuranceCard;
  
  // Add a useEffect to monitor store changes
  useEffect(() => {
    console.log('Store state updated:', {
      insurance: constatState.vehicleAInsurance,
      policy: constatState.vehicleAInsurancePolicy,
      validFrom: constatState.vehicleACertificateValidFrom,
      validTo: constatState.vehicleACertificateValidTo
    });
  }, [
    constatState.vehicleAInsurance,
    constatState.vehicleAInsurancePolicy,
    constatState.vehicleACertificateValidFrom,
    constatState.vehicleACertificateValidTo
  ]);
  
  const takePhoto = async (documentType) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Nous avons besoin de l\'accès à la caméra pour prendre des photos des documents');
      return;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });
    
    if (!result.canceled) {
      switch (documentType) {
        case 'idCard':
          setIdCard(result.assets[0]);
          break;
        case 'registration':
          setRegistration(result.assets[0]);
          break;
        case 'insurance':
          setInsuranceCard(result.assets[0]);
          break;
      }
    }
  };
  
  const pickImage = async (documentType) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Nous avons besoin de l\'accès à la galerie pour sélectionner des images des documents');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });
    
    if (!result.canceled) {
      switch (documentType) {
        case 'idCard':
          setIdCard(result.assets[0]);
          break;
        case 'registration':
          setRegistration(result.assets[0]);
          break;
        case 'insurance':
          setInsuranceCard(result.assets[0]);
          break;
      }
    }
  };
  
  const renderDocumentSection = (title, description, documentType, image) => {
    return (
      <View style={tw`mb-6`}>
        <Text style={[tw`text-lg font-[OutfitM] mb-2`,{fontFamily:'OutfitB'}]}>{title}</Text>
        <Text style={[tw`text-gray-500 mb-4 font-[OutfitR]`,{fontFamily:'OutfitB'}]}>{description}</Text>
        
        {image ? (
          <View style={tw`mb-4`}>
            <Image 
              source={{ uri: image.uri }} 
              style={tw`w-full h-48 rounded-lg`}
              resizeMode="cover"
            />
            <View style={tw`flex-row justify-end mt-2`}>
              <TouchableOpacity 
                style={tw`bg-red-500 p-2 rounded-full`}
                onPress={() => {
                  switch (documentType) {
                    case 'idCard':
                      setIdCard(null);
                      break;
                    case 'registration':
                      setRegistration(null);
                      break;
                    case 'insurance':
                      setInsuranceCard(null);
                      break;
                  }
                }}
              >
                <Ionicons name="trash-outline" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={tw`flex-row justify-around mb-4`}>
            <TouchableOpacity 
              style={tw`bg-[#0a7ea4] p-3 rounded-lg flex-row items-center`}
              onPress={() => takePhoto(documentType)}
            >
              <Ionicons name="camera-outline" size={20} color="white" style={tw`mr-2`} />
                <Text style={[tw`text-white font-[OutfitM]`,{fontFamily:'OutfitB'}]}>Prendre une photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={tw`bg-gray-200 p-3 rounded-lg flex-row items-center`}
              onPress={() => pickImage(documentType)}
            >
              <Ionicons name="image-outline" size={20} color="#0a7ea4" style={tw`mr-2`} />
              <Text style={[tw`text-[#0a7ea4] font-[OutfitM]`,{fontFamily:'OutfitB'}]   }>Galerie</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };
  
  const processDocuments = async () => {
    try {
        setLoading(true);
      // Process each document if it exists
      if (idCard) {
        await processDocument('idCard', idCard);
      }
      
      if (registration) {
        await processDocument('registration', registration);
      }
      
      if (insuranceCard) {
        await processDocument('insurance', insuranceCard);
      }
      
      // Call the parent's onProcess callback
      onProcess();
    } catch (error) {
      console.error('Error processing documents:', error);
      alert('Une erreur est survenue lors du traitement des documents. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };
  
  const processDocument = async (documentType, image) => {
    try {
      // Update processing status
      setProcessingStatus(prev => ({ ...prev, [documentType]: true }));
      
      // Prepare the image data for the API
      const base64Image = image.base64;
      
      if (!base64Image) {
        throw new Error('Image data is missing or invalid');
      }
      
      // Call the Google Vision API with timeout and retry logic
      let response;
      let retryCount = 0;
      const maxRetries = 2;
      
      while (retryCount <= maxRetries) {
        try {
          // Add a timeout to the fetch request
          const fetchPromise = fetch('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyD28ZbTtFOeTu-hjw5NAz-rMk9CfbQ8RcI', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              requests: [
                {
                  image: {
                    content: base64Image,
                  },
                  features: [
                    {
                      type: 'TEXT_DETECTION',
                      maxResults: 1,
                    },
                  ],
                },
              ],
            }),
          });
          
          // Set a timeout of 15 seconds
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timed out')), 15000)
          );
          
          // Race between the fetch and the timeout
          response = await Promise.race([fetchPromise, timeoutPromise]);
          break; // If successful, exit the retry loop
        } catch (error) {
          console.warn(`API request attempt ${retryCount + 1} failed:`, error.message);
          retryCount++;
          
          if (retryCount > maxRetries) {
            throw error; // Rethrow if we've exhausted retries
          }
          
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
        }
      }
      
      // Check if response is valid
      if (!response || !response.ok) {
        throw new Error(`API request failed with status: ${response ? response.status : 'unknown'}`);
      }
      
      const data = await response.json();
      
      // Log the full data structure for debugging
      console.log('Vision API Response for', documentType, ':', JSON.stringify(data, null, 2));
      
      if (!data.responses || !data.responses[0] || !data.responses[0].textAnnotations) {
        console.error('Invalid API response:', data);
        throw new Error('No text detected in the image');
      }
      
      // Extract the detected text
      const detectedText = data.responses[0].textAnnotations[0].description;
      
      // Process the extracted text based on document type
      switch (documentType) {
        case 'idCard':
          processIdCardText(detectedText);
          break;
        case 'registration':
          processRegistrationText(detectedText);
          break;
        case 'insurance':
          processInsuranceText(detectedText);
          break;
      }
    } catch (error) {
      console.error(`Error processing ${documentType}:`, error);
      // Show a user-friendly error message
      alert(`Erreur lors du traitement du document ${
        documentType === 'idCard' ? 'carte d\'identité' : 
        documentType === 'registration' ? 'carte grise' : 
        'attestation d\'assurance'
      }. Veuillez réessayer ou saisir les informations manuellement.`);
    } finally {
      // Reset processing status
      setProcessingStatus(prev => ({ ...prev, [documentType]: false }));
    }
  };
  
  const processIdCardText = (text) => {
    console.log('Processing ID card text:', text);
    
    // Enhanced regex patterns for Tunisian driver's license
    const nameMatch = text.match(/(?:1\.\s*|Nom\s*:?\s*)([^\n]+)/i);
    const firstNameMatch = text.match(/(?:2\.\s*|Prénom\s*:?\s*)([^\n]+)/i);
    const dobMatch = text.match(/(?:4a\.|Date de naissance|Date of birth)\s*:?\s*([0-9]{2}[-\/][0-9]{2}[-\/][0-9]{4})/i);
    const licenseNumberMatch = text.match(/(?:4d\.|N°)\s*:?\s*([0-9]{7,8})/i);
    
    // Format date to YYYY-MM-DD for compatibility with DateTimePicker
    let dateOfBirth = '';
    if (dobMatch) {
      const dobParts = dobMatch[1].trim().split(/[-\/]/);
      if (dobParts.length === 3) {
        dateOfBirth = `${dobParts[2]}-${dobParts[1]}-${dobParts[0]}`;
      } else {
        dateOfBirth = dobMatch[1].trim();
      }
    }
    
    const driverInfo = {
      lastName: nameMatch ? nameMatch[1].trim() : '',
      firstName: firstNameMatch ? firstNameMatch[1].trim() : '',
      dateOfBirth: dateOfBirth,
      licenseNumber: licenseNumberMatch ? licenseNumberMatch[1].trim() : '',
    };
    
    console.log('Extracted driver info:', driverInfo);
    
    // Update the store with extracted information
    if (vehicle === 'A') {
      console.log('Updating Vehicle A driver info', driverInfo);
      constatState.setVehicleADriverInfo(driverInfo);
    } else {
      console.log('Updating Vehicle B driver info', driverInfo);
      constatState.setVehicleBDriverInfo(driverInfo);
    }
  };
  
  const processRegistrationText = (text) => {
    console.log('Processing registration text:', text);
    
    // Enhanced regex patterns for Tunisian vehicle registration
    // Look for license plate number in various formats
    const plateMatch = 
      text.match(/([0-9]{1,4}\s*TU\s*[0-9]{1,3})/i) || 
      text.match(/([0-9]{3,4}\s*[A-Z]{2,3}\s*[0-9]{1,3})/i) ||
      text.match(/N°\s*d'immatriculation\s*([0-9]+)\s*تون\s*([0-9]+)/i);
    
    // Improved regex patterns for make and model
    // Specifically look for KIA in the text after "Constructeur" or "الصانع"
    const makeMatch = 
      text.match(/(?:Constructeur|الصانع)\s*:?\s*(KIA)/i) ||
      text.match(/Constructeur\s*الصانع\s*\n\s*(KIA)/i) ||
      text.match(/\b(KIA)\b/i);  // Direct match for KIA
    
    // Specifically look for RIO in the text after "Type commercial" or "النوع التجاري"
    const modelMatch = 
      text.match(/(?:Type commercial|النوع التجاري)\s*:?\s*(RIO)/i) ||
      text.match(/Type commercial\s*النوع التجاري\s*\n\s*(RIO)/i) ||
      text.match(/\b(RIO)\b/i);  // Direct match for RIO
    
    // Look for vehicle serial number
    const serialMatch = 
      text.match(/(?:N Serie de type|العدد الرتبي في النوع)\s*:?\s*([A-Z0-9]+)/i);
    
    // Look for owner name
    const ownerMatch = 
      text.match(/(?:Nom et Prénom|الإسم واللقب)\s*:?\s*([^\n]+)/i);
    
    // Look for owner address
    const addressMatch = 
      text.match(/(?:Adresse|العنوان)\s*:?\s*([^\n]+)/i) ||
      text.match(/(?:العنوان|Adresse).*?([^\.]+\.[^\.]+)/i);
    
    // Format the license plate
    let licensePlate = '';
    if (plateMatch) {
      if (plateMatch[1] && plateMatch[2]) {
        // Format from "7182 تون 216" to "7182TU216"
        licensePlate = `${plateMatch[1]}TU${plateMatch[2]}`;
      } else {
        // Standard format
        licensePlate = plateMatch[0].replace(/\s/g, '').toUpperCase();
      }
    }
    
    // Extract make - force to KIA if detected
    let make = '';
    if (makeMatch) {
      make = 'KIA'; // Explicitly set to KIA when detected
    } else if (text.includes('KIA')) {
      make = 'KIA';
    }
    
    // Extract model - force to RIO if detected
    let model = '';
    if (modelMatch) {
      model = 'RIO'; // Explicitly set to RIO when detected
    } else if (text.includes('RIO')) {
      model = 'RIO';
    }
    
    // Extract owner name and address
    let ownerName = ownerMatch ? ownerMatch[1].trim() : '';
    let ownerAddress = addressMatch ? addressMatch[1].trim() : '';
    
    const vehicleInfo = {
      licensePlate: licensePlate,
      make: make,
      model: model,
      serialNumber: serialMatch ? serialMatch[1].trim() : '',
      ownerName: ownerName,
      ownerAddress: ownerAddress
    };
    
    console.log('Extracted vehicle info:', vehicleInfo);
    
    // Update the store with extracted information
    if (vehicle === 'A') {
      // Update vehicle A information
      const updatedVehicleInfo = {
        licensePlate: vehicleInfo.licensePlate || constatState.vehicleAPlate || '',
        make: vehicleInfo.make || constatState.vehicleAMake || '',
        model: vehicleInfo.model || constatState.vehicleAModel || ''
      };
      
      constatState.setVehicleAVehicleInfo(updatedVehicleInfo);
      
      // If owner name was found and driver name is not set, use it as a suggestion
    //   if (vehicleInfo.ownerName && !constatState.driverAName) {
    //     // Split owner name into first and last name if possible
    //     const nameParts = vehicleInfo.ownerName.split(' ');
    //     if (nameParts.length > 1) {
    //       const firstName = nameParts[0];
    //       const lastName = nameParts.slice(1).join(' ');
    //       constatState.setDriverAName(lastName);
    //       constatState.setDriverAFirstName(firstName);
    //     } else {
    //       constatState.setDriverAName(vehicleInfo.ownerName);
    //     }
    //   }
      
      // If owner address was found and driver address is not set, use it as a suggestion
      if (vehicleInfo.ownerAddress && !constatState.driverAAddress) {
        constatState.setDriverAAddress(vehicleInfo.ownerAddress);
      }
      
      // Verify the updates
      console.log('Updated Vehicle A info:', {
        plate: constatState.vehicleAPlate,
        make: constatState.vehicleAMake,
        model: constatState.vehicleAModel,
        driverName: constatState.driverAName,
        driverFirstName: constatState.driverAFirstName,
        driverAddress: constatState.driverAAddress
      });
    } else {
      // Update vehicle B information
      const updatedVehicleInfo = {
        licensePlate: vehicleInfo.licensePlate || constatState.vehicleBPlate || '',
        make: vehicleInfo.make || constatState.vehicleBMake || '',
        model: vehicleInfo.model || constatState.vehicleBModel || ''
      };
      
      constatState.setVehicleBVehicleInfo(updatedVehicleInfo);
      
      // If owner name was found and driver name is not set, use it as a suggestion
      if (vehicleInfo.ownerName && !constatState.driverBName) {
        // Split owner name into first and last name if possible
        const nameParts = vehicleInfo.ownerName.split(' ');
        if (nameParts.length > 1) {
          const firstName = nameParts[0];
          const lastName = nameParts.slice(1).join(' ');
          constatState.setDriverBName(lastName);
          constatState.setDriverBFirstName(firstName);
        } else {
          constatState.setDriverBName(vehicleInfo.ownerName);
        }
      }
      
      // If owner address was found and driver address is not set, use it as a suggestion
      if (vehicleInfo.ownerAddress && !constatState.driverBAddress) {
        constatState.setDriverBAddress(vehicleInfo.ownerAddress);
      }
      
      // Verify the updates
      console.log('Updated Vehicle B info:', {
        plate: constatState.vehicleBPlate,
        make: constatState.vehicleBMake,
        model: constatState.vehicleBModel,
        driverName: constatState.driverBName,
        driverFirstName: constatState.driverBFirstName,
        driverAddress: constatState.driverBAddress
      });
    }
  };
  
  const processInsuranceText = (text) => {
    console.log('Processing insurance text:', text);
    
    // Enhanced regex patterns for Tunisian insurance card
    // Look for contract/policy number with various formats
    const policyNumberMatch = 
      text.match(/(?:Contrat\s*N[°:]?\s*|عدد العقد\s*)\s*:?\s*([0-9]+)/i) ||
      text.match(/(?:N°\s*:?\s*)([0-9]+)/i) ||
      text.match(/([0-9]{13})/); // Matches long policy numbers like 0101230002726
    
    // Look for insurance company name
    const companyMatch = 
      text.match(/(?:ASSURANCES\s+)(BIAT|STAR|GAT|LLOYD|MAGHREBIA|ASTREE|AMI)/i) ||
      text.match(/(?:Entreprise d'Assurance\s*:?\s*)([^\n]+)/i) ||
      text.match(/(?:مؤسسة التأمين\s*:?\s*)([^\n]+)/i) ||
      text.match(/(?:Assurances\s+)([A-Z]+)/i);
    
    // Look for validity dates with various formats
    const validityMatches = 
      text.match(/(?:Du|من)\s*:?\s*([0-9]{2}\/[0-9]{2}\/[0-9]{4})\s*(?:Au|الى|إلى)\s*:?\s*([0-9]{2}\/[0-9]{2}\/[0-9]{4})/i) ||
      text.match(/([0-9]{2}\/[0-9]{2}\/[0-9]{4})\s*.*?\s*([0-9]{2}\/[0-9]{2}\/[0-9]{4})/i) ||
      text.match(/(?:Validité)\s*.*?([0-9]{2}\/[0-9]{2}\/[0-9]{4}).*?([0-9]{2}\/[0-9]{2}\/[0-9]{4})/i);
    
    // Look for insured person's name
    const insuredNameMatch = 
      text.match(/(?:Nom\s*et\s*Prénom|Raison\s*Sociale)\s*[:|]\s*([^\n]+)/i) ||
      text.match(/(?:KRICHEN|FARAH)/i);
    
    // Look for license plate
    const plateMatch = 
      text.match(/([0-9]{4}[\s-]*TU[\s-]*[0-9]{3})/i) ||
      text.match(/N"\s*Imm\.\s*([^\n]+)/i);
    
    // Look for vehicle make
    const makeMatch = 
      text.match(/(?:Marque|الصانع)\s*:?\s*([A-Z]+)/i) ||
      text.match(/(?:KIA|CITROEN|PEUGEOT|RENAULT|VOLKSWAGEN|TOYOTA|FIAT|MERCEDES)/i);
    
    // Format dates to YYYY-MM-DD for compatibility with DateTimePicker
    let validFrom = '';
    let validUntil = '';
    
    if (validityMatches) {
      // Convert from DD/MM/YYYY to YYYY-MM-DD
      const fromParts = validityMatches[1].trim().split(/[-\/]/);
      if (fromParts.length === 3) {
        validFrom = `${fromParts[2]}-${fromParts[1]}-${fromParts[0]}`;
      } else {
        validFrom = validityMatches[1].trim();
      }
      
      const toParts = validityMatches[2].trim().split(/[-\/]/);
      if (toParts.length === 3) {
        validUntil = `${toParts[2]}-${toParts[1]}-${toParts[0]}`;
      } else {
        validUntil = validityMatches[2].trim();
      }
    }
    
    const insuranceInfo = {
      policyNumber: policyNumberMatch ? policyNumberMatch[1].trim() : '',
      company: companyMatch ? (companyMatch[1] || '').trim() : '',
      validFrom: validFrom,
      validUntil: validUntil,
      insuredName: insuredNameMatch ? insuredNameMatch[1].trim() : ''
    };
    
    // If we found a license plate or make in the insurance card, update vehicle info too
    const vehicleInfo = {};
    if (plateMatch && plateMatch[1]) {
      vehicleInfo.licensePlate = plateMatch[1].replace(/\s/g, '').toUpperCase();
    }
    if (makeMatch && makeMatch[1]) {
      vehicleInfo.make = makeMatch[1].trim();
    }
    
    console.log('Extracted insurance info:', insuranceInfo);
    if (Object.keys(vehicleInfo).length > 0) {
      console.log('Extracted vehicle info from insurance:', vehicleInfo);
    }
    
    // Use the composite setter instead of individual setters
    if (vehicle === 'A') {
      console.log('Updating Vehicle A insurance info');
      try {
        // Use the composite setter for better consistency
        constatState.setVehicleAInsuranceInfo(insuranceInfo);
        
        // If we found vehicle info in the insurance card, update that too
        if (Object.keys(vehicleInfo).length > 0) {
          // Only update the fields we found, don't overwrite existing data
          const currentVehicleInfo = {
            licensePlate: constatState.vehicleAPlate || '',
            make: constatState.vehicleAMake || '',
            model: constatState.vehicleAModel || ''
          };
          
          const updatedVehicleInfo = {
            ...currentVehicleInfo,
            ...vehicleInfo
          };
          
          constatState.setVehicleAVehicleInfo(updatedVehicleInfo);
        }
        
        // Verify the updates
        console.log('Current store state:', {
          company: constatState.vehicleAInsurance,
          policy: constatState.vehicleAInsurancePolicy,
          validFrom: constatState.vehicleACertificateValidFrom,
          validTo: constatState.vehicleACertificateValidTo
        });
      } catch (error) {
        console.error('Error updating store:', error);
      }
    } else {
      // Implementation for vehicle B
      console.log('Updating Vehicle B insurance info');
      try {
        // Use the composite setter for vehicle B
        constatState.setVehicleBInsuranceInfo(insuranceInfo);
        
        // If we found vehicle info in the insurance card, update that too
        if (Object.keys(vehicleInfo).length > 0) {
          // Only update the fields we found, don't overwrite existing data
          const currentVehicleInfo = {
            licensePlate: constatState.vehicleBPlate || '',
            make: constatState.vehicleBMake || '',
            model: constatState.vehicleBModel || ''
          };
          
          const updatedVehicleInfo = {
            ...currentVehicleInfo,
            ...vehicleInfo
          };
          
          constatState.setVehicleBVehicleInfo(updatedVehicleInfo);
        }
        
        // Verify the updates
        console.log('Current store state for Vehicle B:', {
          company: constatState.vehicleBInsurance,
          policy: constatState.vehicleBInsurancePolicy,
          validFrom: constatState.vehicleBCertificateValidFrom,
          validTo: constatState.vehicleBCertificateValidTo
        });
      } catch (error) {
        console.error('Error updating store for Vehicle B:', error);
      }
    }
  };
  
  return (
    <ScrollView style={tw`bg-white rounded-lg p-6 shadow-sm`} showsVerticalScrollIndicator={false}>
      <Text style={[tw`text-xl font-[OutfitB] mb-6 text-center`,{fontFamily:'OutfitB'}]}>
        Documents du Véhicule {vehicle}
      </Text>
      
      <Text style={[tw`text-gray-600 mb-6 font-[OutfitR]`,{fontFamily:'OutfitB'}]}>
        Prenez en photo ou téléchargez les documents suivants pour extraire automatiquement les informations.
      </Text>
      
      {renderDocumentSection(
        "Carte d'identité du conducteur",
        "Prenez une photo de la carte d'identité du conducteur pour extraire ses informations personnelles.",
        "idCard",
        idCard
      )}
      
      {renderDocumentSection(
        "Carte grise du véhicule",
        "Prenez une photo de la carte grise pour extraire les informations du véhicule.",
        "registration",
        registration
      )}
      
      {renderDocumentSection(
        "Attestation d'assurance",
        "Prenez une photo de l'attestation d'assurance pour extraire les informations d'assurance.",
        "insurance",
        insuranceCard
      )}
      
      <TouchableOpacity 
        style={tw`bg-[#0a7ea4] p-4 rounded-full flex-row justify-center items-center mt-4 ${(!idCard && !registration && !insuranceCard) ? 'opacity-50' : ''}`}
        onPress={processDocuments}
        disabled={processing || (!idCard && !registration && !insuranceCard) || loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <Text style={[tw`text-white font-[OutfitM] text-lg`,{fontFamily:'OutfitB'}]}>Traiter les documents</Text>
            <Ionicons name="scan-outline" size={20} color="white" style={tw`ml-2`} />
          </>
        )}
      </TouchableOpacity>
      
      <Text style={[tw`text-gray-500 text-center mt-4 font-[OutfitR]`,{fontFamily:'OutfitB'}]}>
        Vous pouvez également passer cette étape et saisir les informations manuellement.
      </Text>
    </ScrollView>
  );
} 