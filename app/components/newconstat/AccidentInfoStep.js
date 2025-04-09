import { View, Text, TextInput, TouchableOpacity, Switch, ScrollView } from 'react-native';
import tw from 'twrnc';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useConstatStore } from '../../../store/constatStore';

export default function AccidentInfoStep() {
  const {
    title,
    setTitle,
    accidentDate,
    setAccidentDate,
    accidentTime,
    setAccidentTime,
    accidentLocation,
    setAccidentLocation,
    hasInjuries,
    setHasInjuries,
    hasMaterialDamage,
    setHasMaterialDamage,
    witnesses,
    setWitnesses
  } = useConstatStore();
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setAccidentDate(selectedDate.toISOString().split('T')[0]);
    }
  };
  
  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setAccidentTime(selectedTime.toTimeString().split(' ')[0].substring(0, 5));
    }
  };
  
  const FieldBubble = ({ number }) => (
    <View style={tw`h-6 w-6 rounded-full bg-gray-700 items-center justify-center mr-2`}>
      <Text style={tw`text-white font-[OutfitB] text-xs`}>{number}</Text>
    </View>
  );
  
  return (
    <ScrollView style={tw`bg-white rounded-lg p-6 shadow-sm`} showsVerticalScrollIndicator={false}>
      <Text style={tw`text-xl font-[OutfitB] mb-6 text-center`}>
        Informations sur l'accident
      </Text>
      
      {/* <View style={tw`mb-4`}>
        <Text style={tw`text-gray-700 mb-1 font-[OutfitM]`}>Titre du constat</Text>
        <TextInput
          style={tw`border border-gray-300 rounded-lg p-3 font-[OutfitR]`}
          placeholder="Ex: Accident rue de Paris"
          value={title}
          onChangeText={setTitle}
        />
      </View> */}
      
      <View style={tw`mb-4`}>
        <View style={tw`flex-row items-center mb-1`}>
          <FieldBubble number="1" />
          <Text style={tw`text-gray-700 font-[OutfitM]`}>Date de l'accident</Text>
        </View>
        <TouchableOpacity 
          style={tw`border border-gray-300 rounded-lg p-3 flex-row justify-between items-center`}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={tw`font-[OutfitR] ${accidentDate ? 'text-black' : 'text-gray-400'}`}>
            {accidentDate || 'Sélectionner une date'}
          </Text>
          <Ionicons name="calendar-outline" size={20} color="#0a7ea4" />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={accidentDate ? new Date(accidentDate) : new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>
      
      <View style={tw`mb-4`}>
        <View style={tw`flex-row items-center mb-1`}>
          <FieldBubble number="1" />
          <Text style={tw`text-gray-700 font-[OutfitM]`}>Heure de l'accident</Text>
        </View>
        <TouchableOpacity 
          style={tw`border border-gray-300 rounded-lg p-3 flex-row justify-between items-center`}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={tw`font-[OutfitR] ${accidentTime ? 'text-black' : 'text-gray-400'}`}>
            {accidentTime || 'Sélectionner une heure'}
          </Text>
          <Ionicons name="time-outline" size={20} color="#0a7ea4" />
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={accidentTime ? new Date(`2000-01-01T${accidentTime}:00`) : new Date()}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}
      </View>
      
      <View style={tw`mb-4`}>
        <View style={tw`flex-row items-center mb-1`}>
          <FieldBubble number="2" />
          <Text style={tw`text-gray-700 font-[OutfitM]`}>Lieu de l'accident</Text>
        </View>
        <TextInput
          style={tw`border border-gray-300 rounded-lg p-3 font-[OutfitR]`}
          placeholder="Adresse complète"
          value={accidentLocation}
          onChangeText={setAccidentLocation}
        />
      </View>
      
      <View style={tw`mb-4`}>
        <View style={tw`flex-row items-center mb-1`}>
          <FieldBubble number="3" />
          <Text style={tw`text-gray-700 font-[OutfitM]`}>Blessés (même légers)</Text>
        </View>
        <View style={tw`flex-row`}>
          <TouchableOpacity 
            style={tw`flex-row items-center mr-4`}
            onPress={() => setHasInjuries(true)}
          >
            <View style={tw`h-5 w-5 rounded-full border border-gray-400 mr-2 ${hasInjuries === true ? 'bg-[#0a7ea4] border-[#0a7ea4]' : ''}`}>
              {hasInjuries === true && <Ionicons name="checkmark" size={16} color="white" />}
            </View>
            <Text style={tw`font-[OutfitR]`}>Oui</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={tw`flex-row items-center`}
            onPress={() => setHasInjuries(false)}
          >
            <View style={tw`h-5 w-5 rounded-full border border-gray-400 mr-2 ${hasInjuries === false ? 'bg-[#0a7ea4] border-[#0a7ea4]' : ''}`}>
              {hasInjuries === false && <Ionicons name="checkmark" size={16} color="white" />}
            </View>
            <Text style={tw`font-[OutfitR]`}>Non</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={tw`mb-4`}>
        <View style={tw`flex-row items-center mb-1`}>
          <FieldBubble number="4" />
          <Text style={tw`text-gray-700 font-[OutfitM]`}>Dégâts matériels autres qu'aux véhicules A et B</Text>
        </View>
        <View style={tw`flex-row`}>
          <TouchableOpacity 
            style={tw`flex-row items-center mr-4`}
            onPress={() => setHasMaterialDamage(true)}
          >
            <View style={tw`h-5 w-5 rounded-full border border-gray-400 mr-2 ${hasMaterialDamage === true ? 'bg-[#0a7ea4] border-[#0a7ea4]' : ''}`}>
              {hasMaterialDamage === true && <Ionicons name="checkmark" size={16} color="white" />}
            </View>
            <Text style={tw`font-[OutfitR]`}>Oui</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={tw`flex-row items-center`}
            onPress={() => setHasMaterialDamage(false)}
          >
            <View style={tw`h-5 w-5 rounded-full border border-gray-400 mr-2 ${hasMaterialDamage === false ? 'bg-[#0a7ea4] border-[#0a7ea4]' : ''}`}>
              {hasMaterialDamage === false && <Ionicons name="checkmark" size={16} color="white" />}
            </View>
            <Text style={tw`font-[OutfitR]`}>Non</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={tw`mb-4`}>
        <View style={tw`flex-row items-center mb-1`}>
          <FieldBubble number="5" />
          <Text style={tw`text-gray-700 font-[OutfitM]`}>Témoins (noms, adresses, tél)</Text>
        </View>
        <TextInput
          style={tw`border border-gray-300 rounded-lg p-3 h-24 font-[OutfitR]`}
          placeholder="Informations sur les témoins"
          value={witnesses}
          onChangeText={setWitnesses}
          multiline
        />
      </View>
    </ScrollView>
  );
} 