import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '../lib/supabase';
import { Picker } from '@react-native-picker/picker';

export default function EditConstat() {
  const params = useLocalSearchParams();
  const constat = JSON.parse(params.constat);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [accidentType, setAccidentType] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (constat) {
      setTitle(constat.title || '');
      setDescription(constat.description || '');
      setLocation(constat.location || '');
      setAccidentType(constat.accident_type || '');
    }
  }, [constat]);
  
  const handleUpdate = async () => {
    if (!title.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un titre');
      return;
    }
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('constats')
        .update({ 
          title, 
          description, 
          location,
          accident_type: accidentType,
          updated_at: new Date()
        })
        .eq('id', constat.id)
        .select();
        
      if (error) throw error;
      
      Alert.alert('Succès', 'Constat mis à jour avec succès');
      
      // Navigate back to detail with updated data
      const updatedConstat = data[0];
      router.push({
        pathname: '/ConstatDetail',
        params: { constat: JSON.stringify(updatedConstat) }
      });
    } catch (error) {
      Alert.alert('Erreur lors de la mise à jour du constat', error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const accidentTypes = [
    { id: 'type1', label: 'Véhicules circulant dans le même sens (cas 1 à 5)' },
    { id: 'type2', label: 'Véhicules circulant en sens inverse (cas 6 à 7)' },
    { id: 'type3', label: 'Véhicules provenant de deux chaussées différentes (cas 8 à 9)' },
    { id: 'type4', label: 'Véhicules en stationnement ou à l\'arrêt (cas 10 à 13)' },
    { id: 'type5', label: 'Cas spéciaux (cas 14 à 25)' },
  ];
  
  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <View style={tw`bg-white p-4 flex-row items-center border-b border-gray-200`}>
        <TouchableOpacity onPress={() => router.back()} style={tw`mr-4`}>
          <Ionicons name="arrow-back" size={24} color="#0a7ea4" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-[OutfitB]`}>Modifier le Constat</Text>
      </View>
      
      <ScrollView style={tw`flex-1 p-4`}>
        <Text style={tw`text-gray-700 mb-2 font-[OutfitM]`}>Titre *</Text>
        <TextInput
          style={tw`bg-white p-3 rounded-lg mb-4 font-[OutfitR]`}
          placeholder="Entrez un titre"
          value={title}
          onChangeText={setTitle}
        />
        
        <Text style={tw`text-gray-700 mb-2 font-[OutfitM]`}>Type d'accident *</Text>
        <View style={tw`bg-white rounded-lg mb-4 overflow-hidden`}>
          <Picker
            selectedValue={accidentType}
            onValueChange={(itemValue) => setAccidentType(itemValue)}
            style={tw`h-12`}
          >
            <Picker.Item label="Sélectionnez le type d'accident" value="" />
            {accidentTypes.map((type) => (
              <Picker.Item key={type.id} label={type.label} value={type.id} />
            ))}
          </Picker>
        </View>
        
        <Text style={tw`text-gray-700 mb-2 font-[OutfitM]`}>Description</Text>
        <TextInput
          style={tw`bg-white p-3 rounded-lg mb-4 h-32 font-[OutfitR]`}
          placeholder="Entrez une description"
          value={description}
          onChangeText={setDescription}
          multiline
          textAlignVertical="top"
        />
        
        <Text style={tw`text-gray-700 mb-2 font-[OutfitM]`}>Lieu</Text>
        <TextInput
          style={tw`bg-white p-3 rounded-lg mb-6 font-[OutfitR]`}
          placeholder="Entrez le lieu"
          value={location}
          onChangeText={setLocation}
        />
      </ScrollView>
      
      <View style={tw`p-4 bg-white border-t border-gray-200`}>
        <TouchableOpacity 
          style={tw`bg-[#0a7ea4] p-3 rounded-lg flex-row justify-center items-center`}
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Ionicons name="save-outline" size={20} color="white" style={tw`mr-2`} />
              <Text style={tw`text-white font-[OutfitM] text-lg`}>Mettre à jour le Constat</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
} 