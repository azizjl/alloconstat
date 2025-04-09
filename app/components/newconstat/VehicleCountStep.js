import { View, Text, TouchableOpacity, Image } from 'react-native';
import tw from 'twrnc';
import { useConstatStore } from '../../../store/constatStore';
import { Ionicons } from '@expo/vector-icons';

export default function VehicleCountStep() {
  const { vehicleCount, setVehicleCount } = useConstatStore();
  
  return (
    <View style={tw`bg-white rounded-lg p-6 shadow-sm`}>
      <Text style={tw`text-xl font-[OutfitB] mb-6 text-center`}>
        Combien de véhicules sont impliqués?
      </Text>
      
      <View style={tw`flex-row justify-around mb-6`}>
        <TouchableOpacity 
          style={tw`items-center ${vehicleCount === 1 ? 'opacity-100' : 'opacity-60'}`}
          onPress={() => setVehicleCount(1)}
        >
          <View style={tw`bg-gray-100 rounded-full p-6 mb-2 ${vehicleCount === 1 ? 'border-2 border-[#0a7ea4]' : ''}`}>
      <Ionicons name="car" size={60} color="#0a7ea4" />
    </View>
          <Text style={tw`text-lg font-[OutfitM] ${vehicleCount === 1 ? 'text-[#0a7ea4]' : 'text-gray-700'}`}>
            1 Véhicule
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={tw`items-center ${vehicleCount === 2 ? 'opacity-100' : 'opacity-60'}`}
          onPress={() => setVehicleCount(2)}
        >
          <View style={tw`bg-gray-100 rounded-full p-6 mb-2 ${vehicleCount === 2 ? 'border-2 border-[#0a7ea4]' : ''}`}>
      <View style={tw`flex-row`}>
        <Ionicons name="car" size={50} color="#0a7ea4" />
        <Ionicons name="car" size={50} color="#0a7ea4" style={tw`ml-2`} />
      </View>
    </View>
          <Text style={tw`text-lg font-[OutfitM] ${vehicleCount === 2 ? 'text-[#0a7ea4]' : 'text-gray-700'}`}>
            2 Véhicules
          </Text>
        </TouchableOpacity>
      </View>
      
      <Text style={tw`text-gray-500 text-center font-[OutfitR]`}>
        Sélectionnez le nombre de véhicules impliqués dans l'accident pour continuer.
      </Text>
    </View>
  );
} 