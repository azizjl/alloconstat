import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { useConstatStore } from '../../../store/constatStore';
import { useState, useEffect } from 'react';

export default function CircumstancesStep({ isVehicleA }) {
  const constatState = useConstatStore();
  
  // Get the appropriate state values and setters based on vehicle
  const vehicleCircumstances = isVehicleA 
    ? constatState.vehicleACircumstances 
    : constatState.vehicleBCircumstances;
    
  const setVehicleCircumstances = isVehicleA 
    ? constatState.setVehicleACircumstances 
    : constatState.setVehicleBCircumstances;
  
  // Initialize selected circumstances from stored string
  const [selectedCircumstances, setSelectedCircumstances] = useState(() => {
    if (!vehicleCircumstances) return [];
    try {
      return JSON.parse(vehicleCircumstances);
    } catch {
      return [];
    }
  });
  
  // Update store when selections change
  useEffect(() => {
    setVehicleCircumstances(selectedCircumstances);
  }, [selectedCircumstances]);
  
  // Handle circumstance selection
  const toggleCircumstance = (id) => {
    let newSelected;
    if (selectedCircumstances.includes(id)) {
      newSelected = selectedCircumstances.filter(item => item !== id);
    } else {
      newSelected = [...selectedCircumstances, id];
    }
    setSelectedCircumstances(newSelected);
  };
  
  // List of circumstances from the image
  const circumstances = [
    { id: 1, label: 'en stationnement' },
    { id: 2, label: 'quittait un stationnement' },
    { id: 3, label: 'prenait un stationnement' },
    { id: 4, label: 'sortait d\'un parking, d\'un lieu privé, d\'un chemin de terre' },
    { id: 5, label: 's\'engageait dans un parking, un lieu privé, un chemin de terre' },
    { id: 6, label: 'arrêt de circulation' },
    { id: 7, label: 'frottement sans changement de file' },
    { id: 8, label: 'heurtait à l\'arrière, en roulant dans le même sens et sur une même file' },
    { id: 9, label: 'roulait dans le même sens et sur une file différente' },
    { id: 10, label: 'changeait de file' },
    { id: 11, label: 'doublait' },
    { id: 12, label: 'virait à droite' },
    { id: 13, label: 'virait à gauche' },
    { id: 14, label: 'reculait' },
    { id: 15, label: 'empiétait sur la partie de chaussée réservée à la circulation en sens inverse' },
    { id: 16, label: 'venait de droite (dans un carrefour)' },
    { id: 17, label: 'n\'avait pas observé le signal de priorité' }
  ];
  
  return (
    <ScrollView style={tw`bg-white rounded-lg shadow-sm`} contentContainerStyle={tw`p-6`}>
      <Text style={[tw`text-xl font-[OutfitB] mb-6 text-center`,{fontFamily:'OutfitB'}] }>
        Circonstances - Véhicule {isVehicleA ? 'A' : 'B'}
      </Text>
      
      <Text style={[tw`text-gray-500 mb-4 font-[OutfitR]`,{fontFamily:'OutfitB'}]}>
        Mettre une croix (x) dans chacune des cases utiles pour préciser le croquis
      </Text>
      
      <View style={tw`mt-2`}>
        {circumstances.map((circumstance) => (
          <TouchableOpacity 
            key={circumstance.id}
            style={tw`flex-row items-center py-3 border-b border-gray-200`}
            onPress={() => toggleCircumstance(circumstance.id)}
          >
            <View style={tw`w-6 h-6 border-2 rounded mr-3 items-center justify-center ${selectedCircumstances.includes(circumstance.id) ? 'bg-[#0a7ea4] border-[#0a7ea4]' : 'border-gray-400'}`}>
              {selectedCircumstances.includes(circumstance.id) && (
                <Ionicons name="checkmark" size={18} color="white" />
              )}
            </View>
            <Text style={[tw`text-gray-800 font-[OutfitR] text-base`,{fontFamily:'OutfitB'}]}>{circumstance.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={tw`mt-6 p-4 bg-gray-100 rounded-lg`}>
        <Text style={[tw`text-gray-800 font-[OutfitB] text-base`,{fontFamily:'OutfitB'}]  }>
          Nombre de cases cochées: {selectedCircumstances.length}
        </Text>
      </View>
    </ScrollView>
  );
} 