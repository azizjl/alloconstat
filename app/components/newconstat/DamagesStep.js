import { View, Text, TextInput, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { useConstatStore } from '../../../store/constatStore';
import { useState } from 'react';

export default function DamagesStep({ isVehicleA }) {
  const constatState = useConstatStore();
  
  // Get the appropriate state values and setters based on vehicle
  const vehicleDamages = isVehicleA ? constatState.vehicleADamages : constatState.vehicleBDamages;
  const setVehicleDamages = isVehicleA ? constatState.setVehicleADamages : constatState.setVehicleBDamages;
  
  const vehicleObservations = isVehicleA ? constatState.vehicleAObservations : constatState.vehicleBObservations;
  const setVehicleObservations = isVehicleA ? constatState.setVehicleAObservations : constatState.setVehicleBObservations;
  
  // For impact point selection
  const [impactPoint, setImpactPoint] = useState({ x: 0, y: 0 });
  const [showImpactPoint, setShowImpactPoint] = useState(false);
  
  // Common types of vehicle damage
  const damageTypes = [
    { id: 'scratches', label: 'Rayures' },
    { id: 'dents', label: 'Bosses' },
    { id: 'broken_lights', label: 'Feux cassés' },
    { id: 'broken_glass', label: 'Vitres brisées' },
    { id: 'bumper_damage', label: 'Pare-chocs endommagé' },
    { id: 'door_damage', label: 'Portes endommagées' },
    { id: 'hood_damage', label: 'Capot endommagé' },
    { id: 'trunk_damage', label: 'Coffre endommagé' },
    { id: 'wheel_damage', label: 'Roues/pneus endommagés' },
    { id: 'other', label: 'Autres dommages' }
  ];
  
  // Initialize selected damage types from stored string
  const [selectedDamages, setSelectedDamages] = useState(() => {
    if (!vehicleDamages) return [];
    try {
      return JSON.parse(vehicleDamages);
    } catch {
      // If not JSON, treat as legacy string data
      return ['other'];
    }
  });
  
  // Handle damage type selection
  const toggleDamageType = (id) => {
    let newSelected;
    if (selectedDamages.includes(id)) {
      newSelected = selectedDamages.filter(item => item !== id);
    } else {
      newSelected = [...selectedDamages, id];
    }
    setSelectedDamages(newSelected);
    setVehicleDamages(JSON.stringify(newSelected));
  };
  
  // Handle impact point selection on the car diagram
  const handleImagePress = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    setImpactPoint({ x: locationX, y: locationY });
    setShowImpactPoint(true);
  };
  
  const FieldBubble = ({ number }) => (
    <View style={tw`h-6 w-6 rounded-full bg-gray-700 items-center justify-center mr-2`}>
      <Text style={tw`text-white font-[OutfitB] text-xs`}>{number}</Text>
    </View>
  );
  
  return (
    <ScrollView style={tw`bg-white rounded-lg shadow-sm`} contentContainerStyle={tw`p-6`}>
      <Text style={tw`text-xl font-[OutfitB] mb-6 text-center`}>
        Dégâts apparents au véhicule {isVehicleA ? 'A' : 'B'}
      </Text>
      
      {/* Point of Impact Section */}
      <View style={tw`mb-6`}>
        <View style={tw`flex-row items-center mb-2`}>
          <FieldBubble number="10" />
          <Text style={tw`text-lg font-[OutfitB] text-gray-800`}>Point de choc initial</Text>
        </View>
        
        <Text style={tw`text-gray-500 mb-3 font-[OutfitR]`}>
          Indiquer par une flèche le point de choc initial
        </Text>
        
        <View style={tw`relative`}>
          <TouchableOpacity onPress={handleImagePress} activeOpacity={0.9}>
            <Image 
              source={require('../../../assets/images/car-diagram.png')} 
              style={tw`w-full h-48`}
              resizeMode="contain"
            />
          </TouchableOpacity>
          
          {showImpactPoint && (
            <View 
              style={[
                tw`absolute items-center justify-center`,
                { left: impactPoint.x - 14, top: impactPoint.y - 14 }
              ]}
            >
              <View style={tw`w-7 h-7 bg-red-500 rounded-full items-center justify-center`}>
                <Ionicons name="close" size={20} color="white" />
              </View>
            </View>
          )}
        </View>
        
        <Text style={tw`text-gray-500 text-center mt-2 font-[OutfitR] text-sm`}>
          Touchez l'image pour indiquer le point d'impact
        </Text>
      </View>
      
      {/* Damage Types Section */}
      <View style={tw`mb-6`}>
        <View style={tw`flex-row items-center mb-2`}>
          <FieldBubble number="11" />
          <Text style={tw`text-lg font-[OutfitB] text-gray-800`}>Dégâts apparents</Text>
        </View>
        
        <View style={tw`mt-2`}>
          {damageTypes.map((damage) => (
            <TouchableOpacity 
              key={damage.id}
              style={tw`flex-row items-center py-3 border-b border-gray-200`}
              onPress={() => toggleDamageType(damage.id)}
            >
              <View style={tw`w-6 h-6 border-2 rounded mr-3 items-center justify-center ${selectedDamages.includes(damage.id) ? 'bg-[#0a7ea4] border-[#0a7ea4]' : 'border-gray-400'}`}>
                {selectedDamages.includes(damage.id) && (
                  <Ionicons name="checkmark" size={18} color="white" />
                )}
              </View>
              <Text style={tw`text-gray-800 font-[OutfitR] text-base`}>{damage.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {selectedDamages.includes('other') && (
          <View style={tw`mt-4`}>
            <Text style={tw`text-gray-700 font-[OutfitM] mb-2`}>Précisez les autres dommages :</Text>
            <TextInput
              style={tw`border border-gray-300 rounded-lg p-3 h-24 font-[OutfitR]`}
              placeholder="Décrivez les autres dégâts visibles sur le véhicule"
              value={typeof vehicleDamages === 'string' && !vehicleDamages.startsWith('[') ? vehicleDamages : ''}
              onChangeText={(text) => {
                // Keep the JSON structure but update the "other" description
                setVehicleDamages(text);
              }}
              multiline
            />
          </View>
        )}
      </View>
      
      {/* Observations Section */}
      <View style={tw`mb-4`}>
        <View style={tw`flex-row items-center mb-2`}>
          <FieldBubble number="14" />
          <Text style={tw`text-lg font-[OutfitB] text-gray-800`}>Observations</Text>
        </View>
        
        <TextInput
          style={tw`border border-gray-300 rounded-lg p-3 h-24 font-[OutfitR]`}
          placeholder="Observations supplémentaires"
          value={vehicleObservations}
          onChangeText={setVehicleObservations}
          multiline
        />
      </View>
    </ScrollView>
  );
}