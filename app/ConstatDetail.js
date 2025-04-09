import { View, Text, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

export default function ConstatDetail() {
  const params = useLocalSearchParams();
  const constat = JSON.parse(params.constat);
  const { user } = useAuthStore();
  const [deleting, setDeleting] = useState(false);
  
  const handleEdit = () => {
    router.push({
      pathname: '/EditConstat',
      params: { constat: JSON.stringify(constat) }
    });
  };
  
  const handleDelete = async () => {
    Alert.alert(
      'Supprimer le Constat',
      'Êtes-vous sûr de vouloir supprimer ce constat ? Cette action ne peut pas être annulée.',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true);
              
              const { error } = await supabase
                .from('constats')
                .delete()
                .eq('id', constat.id);
                
              if (error) throw error;
              
              Alert.alert('Succès', 'Constat supprimé avec succès');
              router.back();
            } catch (error) {
              Alert.alert('Erreur lors de la suppression du constat', error.message);
              setDeleting(false);
            }
          }
        }
      ]
    );
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  const getAccidentTypeLabel = (typeId) => {
    const types = {
      'type1': 'Véhicules circulant dans le même sens (cas 1 à 5)',
      'type2': 'Véhicules circulant en sens inverse (cas 6 à 7)',
      'type3': 'Véhicules provenant de deux chaussées différentes (cas 8 à 9)',
      'type4': 'Véhicules en stationnement ou à l\'arrêt (cas 10 à 13)',
      'type5': 'Cas spéciaux (cas 14 à 25)',
    };
    return types[typeId] || 'Non spécifié';
  };
  
  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <View style={tw`bg-white p-4 flex-row items-center justify-between border-b border-gray-200`}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0a7ea4" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-[OutfitB] flex-1 ml-4`}>Détails du Constat</Text>
        {deleting ? (
          <ActivityIndicator color="#0a7ea4" size="small" />
        ) : (
          <TouchableOpacity onPress={handleDelete}>
            <Ionicons name="trash-outline" size={24} color="#ff3b30" />
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView style={tw`flex-1 p-4`}>
        <View style={tw`bg-white rounded-lg shadow-sm p-4 mb-4`}>
          <Text style={tw`text-2xl font-[OutfitB] mb-2`}>{constat.title}</Text>
          <Text style={tw`text-gray-500 font-[OutfitR] mb-4`}>
            Créé le: {formatDate(constat.created_at)}
          </Text>
          
          {constat.accident_type && (
            <>
              <Text style={tw`text-gray-700 font-[OutfitM] mb-1`}>Type d'accident:</Text>
              <Text style={tw`text-gray-800 font-[OutfitR] mb-4`}>
                {getAccidentTypeLabel(constat.accident_type)}
              </Text>
            </>
          )}
          
          <Text style={tw`text-gray-700 font-[OutfitM] mb-1`}>Description:</Text>
          <Text style={tw`text-gray-800 font-[OutfitR] mb-4`}>
            {constat.description || 'Aucune description fournie'}
          </Text>
          
          {constat.location && (
            <>
              <Text style={tw`text-gray-700 font-[OutfitM] mb-1`}>Lieu:</Text>
              <Text style={tw`text-gray-800 font-[OutfitR] mb-4`}>{constat.location}</Text>
            </>
          )}
        </View>
      </ScrollView>
      
      <View style={tw`p-4 bg-white border-t border-gray-200`}>
        <TouchableOpacity 
          style={tw`bg-[#0a7ea4] p-3 rounded-lg flex-row justify-center items-center`}
          onPress={handleEdit}
        >
          <Ionicons name="create-outline" size={20} color="white" style={tw`mr-2`} />
          <Text style={tw`text-white font-[OutfitM] text-lg`}>Modifier le Constat</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
} 