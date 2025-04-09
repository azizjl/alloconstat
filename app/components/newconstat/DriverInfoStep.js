import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useConstatStore } from '../../../store/constatStore';

export default function DriverInfoStep({ isDriverA }) {
  const constatState = useConstatStore();
  
  // Get the appropriate state values and setters based on driver
  const driverName = isDriverA ? constatState.driverAName : constatState.driverBName;
  const setDriverName = isDriverA ? constatState.setDriverAName : constatState.setDriverBName;
  
  const driverFirstName = isDriverA ? constatState.driverAFirstName : constatState.driverBFirstName;
  const setDriverFirstName = isDriverA ? constatState.setDriverAFirstName : constatState.setDriverBFirstName;
  
  const driverAddress = isDriverA ? constatState.driverAAddress : constatState.driverBAddress;
  const setDriverAddress = isDriverA ? constatState.setDriverAAddress : constatState.setDriverBAddress;
  
  const driverPhone = isDriverA ? constatState.driverAPhone : constatState.driverBPhone;
  const setDriverPhone = isDriverA ? constatState.setDriverAPhone : constatState.setDriverBPhone;
  
  const driverLicense = isDriverA ? constatState.driverALicense : constatState.driverBLicense;
  const setDriverLicense = isDriverA ? constatState.setDriverALicense : constatState.setDriverBLicense;
  
  const driverLicenseDate = isDriverA ? constatState.driverALicenseDate : constatState.driverBLicenseDate;
  const setDriverLicenseDate = isDriverA ? constatState.setDriverALicenseDate : constatState.setDriverBLicenseDate;
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDriverLicenseDate(selectedDate.toISOString().split('T')[0]);
    }
  };
  
  const FieldBubble = ({ number }) => (
    <View style={tw`h-6 w-6 rounded-full bg-gray-700 items-center justify-center mr-2`}>
      <Text style={tw`text-white font-[OutfitB] text-xs`}>{number}</Text>
    </View>
  );
  
  return (
    <View style={tw`bg-white rounded-lg p-6 shadow-sm`}>
      <Text style={tw`text-xl font-[OutfitB] mb-6 text-center`}>
        Conducteur du Véhicule {isDriverA ? 'A' : 'B'}
      </Text>
      
      <View style={tw`mb-6 border-b border-gray-200 pb-4`}>
        <View style={tw`flex-row items-center mb-2`}>
          <FieldBubble number="7" />
          <Text style={tw`text-lg font-[OutfitB] text-gray-800`}>Identité du Conducteur</Text>
        </View>
        
        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1 font-[OutfitM]`}>Nom</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-3 font-[OutfitR]`}
            placeholder="Nom de famille"
            value={driverName}
            onChangeText={setDriverName}
          />
        </View>
        
        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1 font-[OutfitM]`}>Prénom</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-3 font-[OutfitR]`}
            placeholder="Prénom"
            value={driverFirstName}
            onChangeText={setDriverFirstName}
          />
        </View>
        
        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1 font-[OutfitM]`}>Adresse</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-3 font-[OutfitR]`}
            placeholder="Adresse complète"
            value={driverAddress}
            onChangeText={setDriverAddress}
          />
        </View>
        
        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1 font-[OutfitM]`}>Téléphone</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-3 font-[OutfitR]`}
            placeholder="Numéro de téléphone"
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
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={tw`font-[OutfitR] ${driverLicenseDate ? 'text-black' : 'text-gray-400'}`}>
              {driverLicenseDate || 'Sélectionner une date'}
            </Text>
            <Ionicons name="calendar-outline" size={20} color="#0a7ea4" />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={driverLicenseDate ? new Date(driverLicenseDate) : new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>
      </View>
    </View>
  );
} 