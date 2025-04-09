import { View, Text, TextInput, TouchableOpacity, Image, ScrollView  } from 'react-native';
import tw from 'twrnc';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useConstatStore } from '../../../store/constatStore';

export default function VehicleInfoStep({ isVehicleA }) {
  const constatState = useConstatStore();
  
  // Insurance information (Section 6)
  const vehicleInsurance = isVehicleA ? constatState.vehicleAInsurance : constatState.vehicleBInsurance;
  const setVehicleInsurance = isVehicleA ? constatState.setVehicleAInsurance : constatState.setVehicleBInsurance;
  
  const vehicleInsurancePolicy = isVehicleA ? constatState.vehicleAInsurancePolicy : constatState.vehicleBInsurancePolicy;
  const setVehicleInsurancePolicy = isVehicleA ? constatState.setVehicleAInsurancePolicy : constatState.setVehicleBInsurancePolicy;
  
  const vehicleAgency = isVehicleA ? constatState.vehicleAAgency : constatState.vehicleBAgency;
  const setVehicleAgency = isVehicleA ? constatState.setVehicleAAgency : constatState.setVehicleBAgency;
  
  const vehicleCertificateValidFrom = isVehicleA ? constatState.vehicleACertificateValidFrom : constatState.vehicleBCertificateValidFrom;
  const setVehicleCertificateValidFrom = isVehicleA ? constatState.setVehicleACertificateValidFrom : constatState.setVehicleBCertificateValidFrom;
  
  const vehicleCertificateValidTo = isVehicleA ? constatState.vehicleACertificateValidTo : constatState.vehicleBCertificateValidTo;
  const setVehicleCertificateValidTo = isVehicleA ? constatState.setVehicleACertificateValidTo : constatState.setVehicleBCertificateValidTo;
  
  // Driver information (Section 7)
  const driverName = isVehicleA ? constatState.driverAName : constatState.driverBName;
  const setDriverName = isVehicleA ? constatState.setDriverAName : constatState.setDriverBName;
  
  const driverFirstName = isVehicleA ? constatState.driverAFirstName : constatState.driverBFirstName;
  const setDriverFirstName = isVehicleA ? constatState.setDriverAFirstName : constatState.setDriverBFirstName;
  
  const driverAddress = isVehicleA ? constatState.driverAAddress : constatState.driverBAddress;
  const setDriverAddress = isVehicleA ? constatState.setDriverAAddress : constatState.setDriverBAddress;
  
  const driverPhone = isVehicleA ? constatState.driverAPhone : constatState.driverBPhone;
  const setDriverPhone = isVehicleA ? constatState.setDriverAPhone : constatState.setDriverBPhone;
  
  const driverLicense = isVehicleA ? constatState.driverALicense : constatState.driverBLicense;
  const setDriverLicense = isVehicleA ? constatState.setDriverALicense : constatState.setDriverBLicense;
  
  const driverLicenseDate = isVehicleA ? constatState.driverALicenseDate : constatState.driverBLicenseDate;
  const setDriverLicenseDate = isVehicleA ? constatState.setDriverALicenseDate : constatState.setDriverBLicenseDate;
  
  // Insured person information (Section 8)
  const insuredName = isVehicleA ? constatState.insuredAName : constatState.insuredBName;
  const setInsuredName = isVehicleA ? constatState.setInsuredAName : constatState.setInsuredBName;
  
  const insuredFirstName = isVehicleA ? constatState.insuredAFirstName : constatState.insuredBFirstName;
  const setInsuredFirstName = isVehicleA ? constatState.setInsuredAFirstName : constatState.setInsuredBFirstName;
  
  const insuredAddress = isVehicleA ? constatState.insuredAAddress : constatState.insuredBAddress;
  const setInsuredAddress = isVehicleA ? constatState.setInsuredAAddress : constatState.setInsuredBAddress;
  
  const insuredPhone = isVehicleA ? constatState.insuredAPhone : constatState.insuredBPhone;
  const setInsuredPhone = isVehicleA ? constatState.setInsuredAPhone : constatState.setInsuredBPhone;
  
  // Vehicle information (Section 9)
  const vehicleMake = isVehicleA ? constatState.vehicleAMake : constatState.vehicleBMake;
  const setVehicleMake = isVehicleA ? constatState.setVehicleAMake : constatState.setVehicleBMake;
  
  const vehicleModel = isVehicleA ? constatState.vehicleAModel : constatState.vehicleBModel;
  const setVehicleModel = isVehicleA ? constatState.setVehicleAModel : constatState.setVehicleBModel;
  
  const vehiclePlate = isVehicleA ? constatState.vehicleAPlate : constatState.vehicleBPlate;
  const setVehiclePlate = isVehicleA ? constatState.setVehicleAPlate : constatState.setVehicleBPlate;
  
  const vehicleDirection = isVehicleA ? constatState.vehicleADirection : constatState.vehicleBDirection;
  const setVehicleDirection = isVehicleA ? constatState.setVehicleADirection : constatState.setVehicleBDirection;
  
  const vehicleFrom = isVehicleA ? constatState.vehicleAFrom : constatState.vehicleBFrom;
  const setVehicleFrom = isVehicleA ? constatState.setVehicleAFrom : constatState.setVehicleBFrom;
  
  const vehicleTo = isVehicleA ? constatState.vehicleATo : constatState.vehicleBTo;
  const setVehicleTo = isVehicleA ? constatState.setVehicleATo : constatState.setVehicleBTo;
  
  const vehicleImages = isVehicleA ? constatState.vehicleAImages : constatState.vehicleBImages;
  const setVehicleImages = isVehicleA ? constatState.setVehicleAImages : constatState.setVehicleBImages;
  
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [showLicenseDatePicker, setShowLicenseDatePicker] = useState(false);
  
  const handleFromDateChange = (event, selectedDate) => {
    setShowFromDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setVehicleCertificateValidFrom(formattedDate);
    }
  };
  
  const handleToDateChange = (event, selectedDate) => {
    setShowToDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setVehicleCertificateValidTo(formattedDate);
    }
  };
  
  const handleLicenseDateChange = (event, selectedDate) => {
    setShowLicenseDatePicker(false);
    if (selectedDate) {
      setDriverLicenseDate(selectedDate.toISOString().split('T')[0]);
    }
  };
  
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Nous avons besoin de l\'accès à la caméra pour prendre des photos du véhicule');
      return;
    }
    
    if (vehicleImages && vehicleImages.length >= 6) {
      alert('Vous avez atteint le nombre maximum de photos (6)');
      return;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      console.log("Camera result:", result.assets[0]);
      const newImages = vehicleImages ? [...vehicleImages, result.assets[0]] : [result.assets[0]];
      setVehicleImages(newImages);
    }
  };
  
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Nous avons besoin de l\'accès à la galerie pour sélectionner des photos');
      return;
    }
    
    if (vehicleImages && vehicleImages.length >= 6) {
      alert('Vous avez atteint le nombre maximum de photos (6)');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      console.log("Gallery result:", result.assets[0]);
      const newImages = vehicleImages ? [...vehicleImages, result.assets[0]] : [result.assets[0]];
      setVehicleImages(newImages);
    }
  };
  
  const removeImage = (index) => {
    const newImages = [...vehicleImages];
    newImages.splice(index, 1);
    setVehicleImages(newImages.length > 0 ? newImages : null);
  };
  
  const FieldBubble = ({ number }) => (
    <View style={tw`h-6 w-6 rounded-full bg-gray-700 items-center justify-center mr-2`}>
      <Text style={tw`text-white font-[OutfitB] text-xs`}>{number}</Text>
    </View>
  );
  
  return (
    <ScrollView style={tw`bg-white rounded-lg p-6 shadow-sm`} showsVerticalScrollIndicator={false}>
      <Text style={tw`text-xl font-[OutfitB] mb-6 text-center`}>
        Informations sur le Véhicule {isVehicleA ? 'A' : 'B'}
      </Text>
      
      {/* Insurance Information - Section 6 */}
      <View style={tw`mb-6 border-b border-gray-200 pb-4`}>
        <View style={tw`flex-row items-center mb-2`}>
          <FieldBubble number="6" />
          <Text style={tw`text-lg font-[OutfitB] text-gray-800`}>Société d'Assurances</Text>
        </View>
        
        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1 font-[OutfitM]`}>Véhicule assuré par</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-3 font-[OutfitR]`}
            placeholder="Nom de la compagnie d'assurance"
            value={vehicleInsurance}
            onChangeText={setVehicleInsurance}
          />
        </View>
        
        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1 font-[OutfitM]`}>Police d'Assurance N°</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-3 font-[OutfitR]`}
            placeholder="Numéro de police d'assurance"
            value={vehicleInsurancePolicy}
            onChangeText={setVehicleInsurancePolicy}
          />
        </View>
        
        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1 font-[OutfitM]`}>Agence</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-3 font-[OutfitR]`}
            placeholder="Agence d'assurance"
            value={vehicleAgency}
            onChangeText={setVehicleAgency}
          />
        </View>
        
        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1 font-[OutfitM]`}>Attestation valable du</Text>
          <TouchableOpacity 
            style={tw`border border-gray-300 rounded-lg p-3 flex-row justify-between items-center`}
            onPress={() => setShowFromDatePicker(true)}
          >
            <Text style={tw`font-[OutfitR] ${vehicleCertificateValidFrom ? 'text-black' : 'text-gray-400'}`}>
              {vehicleCertificateValidFrom || 'Sélectionner une date'}
            </Text>
            <Ionicons name="calendar-outline" size={20} color="#0a7ea4" />
          </TouchableOpacity>
          {showFromDatePicker && (
            <DateTimePicker
              value={vehicleCertificateValidFrom ? new Date(vehicleCertificateValidFrom) : new Date()}
              mode="date"
              display="default"
              onChange={handleFromDateChange}
            />
          )}
        </View>
        
        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1 font-[OutfitM]`}>au</Text>
          <TouchableOpacity 
            style={tw`border border-gray-300 rounded-lg p-3 flex-row justify-between items-center`}
            onPress={() => setShowToDatePicker(true)}
          >
            <Text style={tw`font-[OutfitR] ${vehicleCertificateValidTo ? 'text-black' : 'text-gray-400'}`}>
              {vehicleCertificateValidTo || 'Sélectionner une date'}
            </Text>
            <Ionicons name="calendar-outline" size={20} color="#0a7ea4" />
          </TouchableOpacity>
          {showToDatePicker && (
            <DateTimePicker
              value={vehicleCertificateValidTo ? new Date(vehicleCertificateValidTo) : new Date()}
              mode="date"
              display="default"
              onChange={handleToDateChange}
            />
          )}
        </View>
      </View>
      
      {/* Driver Information - Section 7 */}
      <View style={tw`mb-6 border-b border-gray-200 pb-4`}>
        <View style={tw`flex-row items-center mb-2`}>
          <FieldBubble number="7" />
          <Text style={tw`text-lg font-[OutfitB] text-gray-800`}>Identité du Conducteur</Text>
        </View>
        
        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1 font-[OutfitM]`}>Nom</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-3 font-[OutfitR]`}
            placeholder="Nom du conducteur"
            value={driverName}
            onChangeText={setDriverName}
          />
        </View>
        
        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1 font-[OutfitM]`}>Prénom</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-3 font-[OutfitR]`}
            placeholder="Prénom du conducteur"
            value={driverFirstName}
            onChangeText={setDriverFirstName}
          />
        </View>
        
        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1 font-[OutfitM]`}>Adresse</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-3 font-[OutfitR]`}
            placeholder="Adresse du conducteur"
            value={driverAddress}
            onChangeText={setDriverAddress}
          />
        </View>
        
        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1 font-[OutfitM]`}>Téléphone</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-3 font-[OutfitR]`}
            placeholder="Téléphone du conducteur"
            value={driverPhone}
            onChangeText={setDriverPhone}
            keyboardType="phone-pad"
          />
        </View>
        
        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1 font-[OutfitM]`}>Permis de conduire N°</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-3 font-[OutfitR]`}
            placeholder="Numéro de permis"
            value={driverLicense}
            onChangeText={setDriverLicense}
          />
        </View>
        
        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1 font-[OutfitM]`}>Délivré le</Text>
          <TouchableOpacity 
            style={tw`border border-gray-300 rounded-lg p-3 flex-row justify-between items-center`}
            onPress={() => setShowLicenseDatePicker(true)}
          >
            <Text style={tw`font-[OutfitR] ${driverLicenseDate ? 'text-black' : 'text-gray-400'}`}>
              {driverLicenseDate || 'Sélectionner une date'}
            </Text>
            <Ionicons name="calendar-outline" size={20} color="#0a7ea4" />
          </TouchableOpacity>
          {showLicenseDatePicker && (
            <DateTimePicker
              value={driverLicenseDate ? new Date(driverLicenseDate) : new Date()}
              mode="date"
              display="default"
              onChange={handleLicenseDateChange}
            />
          )}
        </View>
      </View>
      
      {/* Insured Person Information - Section 8 */}
      <View style={tw`mb-6 border-b border-gray-200 pb-4`}>
        <View style={tw`flex-row items-center mb-2`}>
          <FieldBubble number="8" />
          <Text style={tw`text-lg font-[OutfitB] text-gray-800`}>Assuré (voir attest. d'assur.)</Text>
        </View>
        
        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1 font-[OutfitM]`}>Nom</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-3 font-[OutfitR]`}
            placeholder="Nom de l'assuré"
            value={insuredName}
            onChangeText={setInsuredName}
          />
        </View>
        
        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1 font-[OutfitM]`}>Prénom</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-3 font-[OutfitR]`}
            placeholder="Prénom de l'assuré"
            value={insuredFirstName}
            onChangeText={setInsuredFirstName}
          />
        </View>
        
        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1 font-[OutfitM]`}>Adresse</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-3 font-[OutfitR]`}
            placeholder="Adresse de l'assuré"
            value={insuredAddress}
            onChangeText={setInsuredAddress}
          />
        </View>
        
        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1 font-[OutfitM]`}>Tél</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-3 font-[OutfitR]`}
            placeholder="Téléphone de l'assuré"
            value={insuredPhone}
            onChangeText={setInsuredPhone}
            keyboardType="phone-pad"
          />
        </View>
      </View>
      
      {/* Vehicle Information - Section 9 */}
      <View style={tw`mb-6 border-b border-gray-200 pb-4`}>
        <View style={tw`flex-row items-center mb-2`}>
          <FieldBubble number="9" />
          <Text style={tw`text-lg font-[OutfitB] text-gray-800`}>Identité du Véhicule</Text>
        </View>
        
        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1 font-[OutfitM]`}>Marque, Type</Text>
          <View style={tw`flex-row`}>
            <TextInput
              style={tw`border border-gray-300 rounded-lg p-3 font-[OutfitR] flex-1 mr-2`}
              placeholder="Marque"
              value={vehicleMake}
              onChangeText={setVehicleMake}
            />
            <TextInput
              style={tw`border border-gray-300 rounded-lg p-3 font-[OutfitR] flex-1`}
              placeholder="Modèle"
              value={vehicleModel}
              onChangeText={setVehicleModel}
            />
          </View>
        </View>
        
        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1 font-[OutfitM]`}>N° d'immatriculation</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-3 font-[OutfitR]`}
            placeholder="Ex: 1234 TU 123"
            value={vehiclePlate}
            onChangeText={setVehiclePlate}
          />
        </View>
        
        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1 font-[OutfitM]`}>Sens suivi</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-3 font-[OutfitR]`}
            placeholder="Direction du véhicule"
            value={vehicleDirection}
            onChangeText={setVehicleDirection}
          />
        </View>
        
        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1 font-[OutfitM]`}>Venant de</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-3 font-[OutfitR]`}
            placeholder="Lieu de provenance"
            value={vehicleFrom}
            onChangeText={setVehicleFrom}
          />
        </View>
        
        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1 font-[OutfitM]`}>Allant à</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-3 font-[OutfitR]`}
            placeholder="Destination"
            value={vehicleTo}
            onChangeText={setVehicleTo}
          />
        </View>
      </View>
      
      <View style={tw`mb-6`}>
        <View style={tw`flex-row items-center mb-2`}>
          <FieldBubble number="10" />
          <Text style={tw`text-lg font-[OutfitB] text-gray-800`}>Photos du véhicule</Text>
        </View>
        
        <Text style={tw`text-gray-500 mb-3 font-[OutfitR] text-sm`}>
          Ajoutez jusqu'à 6 photos du véhicule et des dommages
        </Text>
        
        {vehicleImages && vehicleImages.length > 0 ? (
          <View style={tw`mb-4`}>
            <View style={tw`flex-row flex-wrap justify-between`}>
              {vehicleImages.map((image, index) => (
                <View key={index} style={tw`w-[31%] mb-3 relative`}>
                  <Image 
                    source={{ uri: image.uri }} 
                    style={tw`w-full h-24 rounded-lg`}
                    resizeMode="cover"
                  />
                  <TouchableOpacity 
                    style={tw`absolute top-1 right-1 bg-red-500 h-6 w-6 rounded-full items-center justify-center`}
                    onPress={() => removeImage(index)}
                  >
                    <Ionicons name="close" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
              
              {vehicleImages.length < 6 && (
                <View style={tw`w-[31%] h-24 mb-3 border-2 border-dashed border-gray-300 rounded-lg items-center justify-center`}>
                  <TouchableOpacity 
                    style={tw`items-center justify-center w-full h-full`}
                    onPress={takePhoto}
                  >
                    <Ionicons name="add-circle-outline" size={24} color="#0a7ea4" />
                    <Text style={tw`text-[#0a7ea4] text-xs mt-1 font-[OutfitM]`}>Ajouter</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            
            {vehicleImages.length < 6 && (
              <View style={tw`flex-row justify-center mt-2`}>
                <TouchableOpacity 
                  style={tw`bg-[#0a7ea4] py-2 px-4 rounded-lg flex-row items-center mr-3`}
                  onPress={takePhoto}
                >
                  <Ionicons name="camera-outline" size={18} color="white" style={tw`mr-1`} />
                  <Text style={tw`text-white font-[OutfitM] text-sm`}>Appareil photo</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={tw`bg-gray-200 py-2 px-4 rounded-lg flex-row items-center`}
                  onPress={pickImage}
                >
                  <Ionicons name="image-outline" size={18} color="#0a7ea4" style={tw`mr-1`} />
                  <Text style={tw`text-[#0a7ea4] font-[OutfitM] text-sm`}>Galerie</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <View style={tw`mb-4`}>
            <View style={tw`border-2 border-dashed border-gray-300 rounded-lg p-6 items-center justify-center bg-gray-50`}>
              <Ionicons name="images-outline" size={40} color="#0a7ea4" style={tw`mb-2`} />
              <Text style={tw`text-gray-700 font-[OutfitM] mb-4 text-center`}>
                Aucune photo ajoutée
              </Text>
              
              <View style={tw`flex-row justify-center`}>
                <TouchableOpacity 
                  style={tw`bg-[#0a7ea4] py-3 px-5 rounded-lg flex-row items-center mr-3`}
                  onPress={takePhoto}
                >
                  <Ionicons name="camera-outline" size={20} color="white" style={tw`mr-2`} />
                  <Text style={tw`text-white font-[OutfitM]`}>Appareil photo</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={tw`bg-gray-200 py-3 px-5 rounded-lg flex-row items-center`}
                  onPress={pickImage}
                >
                  <Ionicons name="image-outline" size={20} color="#0a7ea4" style={tw`mr-2`} />
                  <Text style={tw`text-[#0a7ea4] font-[OutfitM]`}>Galerie</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        
        <View style={tw`flex-row items-center mt-1`}>
          <Ionicons name="information-circle-outline" size={16} color="gray" style={tw`mr-1`} />
          <Text style={tw`text-gray-500 text-xs font-[OutfitR]`}>
            {vehicleImages ? `${vehicleImages.length}/6 photos ajoutées` : "0/6 photos ajoutées"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
} 