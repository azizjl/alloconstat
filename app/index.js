import { View, Text, TouchableOpacity, Alert, FlatList, ActivityIndicator, RefreshControl, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { useFonts } from 'expo-font';
import { useAuthStore } from '../store/authStore';
import { useState, useEffect, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { supabase } from '../lib/supabase';
import { Linking } from 'react-native';

export default function Home() {
  const { user, signOut } = useAuthStore();
  const [constats, setConstats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showEmergencyServices, setShowEmergencyServices] = useState(false);
  
  const fetchConstats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('constats')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setConstats(data || []);
    } catch (error) {
      Alert.alert('Erreur lors du chargement des constats', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Initial load
  useEffect(() => {
    fetchConstats();
  }, []);
  
  // Refresh when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchConstats();
    }, [])
  );
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchConstats();
  }, []);
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      Alert.alert('Erreur lors de la déconnexion', error.message);
    }
  };
  
  const navigateToCreateConstat = () => {
    router.push('/NewCreateConstat');
  };
  
  const navigateToConstatDetail = (constat) => {
    router.push({
      pathname: '/ConstatDetail',
      params: { constat: JSON.stringify(constat) }
    });
  };
  
  const toggleEmergencyServices = () => {
    setShowEmergencyServices(!showEmergencyServices);
  };
  
  const renderConstatItem = ({ item }) => (
    <TouchableOpacity 
      style={tw`bg-white p-4 rounded-lg shadow-md mb-3`}
      onPress={() => navigateToConstatDetail(item)}
    >
      <Text style={[tw`text-lg font-medium mb-1 font-[OutfitM]`,{fontFamily:'OutfitB'}]}>{item.title}</Text>
      <Text style={tw`text-gray-600 font-[OutfitR]`} numberOfLines={2}>
        {item.description || 'Pas de description'}
      </Text>
      <Text style={tw`text-xs text-gray-500 mt-2 font-[OutfitR]`}>
        {new Date(item.created_at).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <View style={tw`flex-row justify-between items-center p-4 mb-2`}>
        <View style={tw`flex-row items-center`}>
          <Image 
            source={require('../assets/images/logo.png')} 
            style={tw`w-10 h-10 mr-2`}
            resizeMode="contain"
          />
          <Text style={[tw`text-2xl text-[#0a7ea4]`,{fontFamily:'OutfitB'}]}>AlloConstat</Text>
        </View>
        <View style={tw`flex-row`}>
          <TouchableOpacity 
            style={tw`bg-red-500 p-2 rounded-full mr-3`}
            onPress={toggleEmergencyServices}
          >
            <Ionicons name="alert-circle" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={tw`bg-gray-200 p-2 rounded-full`}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={24} color="#0a7ea4" />
          </TouchableOpacity>
        </View>
      </View>
      
      {showEmergencyServices && (
        <View style={tw`mx-4 mb-4 p-4 bg-white rounded-lg shadow-md`}>
          <Text style={[tw`text-lg mb-3 text-gray-800`,{fontFamily:'OutfitB'}]}>
            Services d'urgence
          </Text>
          
          <View style={tw`flex-row flex-wrap justify-between`}>
            <TouchableOpacity
              style={tw`bg-red-500 py-2 px-3 rounded-lg flex-row items-center mb-2 w-[48%]`}
              onPress={() => Linking.openURL('tel:190')}
            >
              <Ionicons name="call" size={18} color="white" style={tw`mr-1`} />
              <Text style={tw`text-white font-[OutfitM]`}>Police (190)</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={tw`bg-red-500 py-2 px-3 rounded-lg flex-row items-center mb-2 w-[48%]`}
              onPress={() => Linking.openURL('tel:198')}
            >
              <Ionicons name="medkit" size={18} color="white" style={tw`mr-1`} />
              <Text style={tw`text-white font-[OutfitM]`}>Ambulance (198)</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={tw`bg-red-500 py-2 px-3 rounded-lg flex-row items-center mb-2 w-[48%]`}
              onPress={() => Linking.openURL('tel:197')}
            >
              <Ionicons name="flame" size={18} color="white" style={tw`mr-1`} />
              <Text style={[tw`text-white font-[OutfitM]`,{fontFamily:'OutfitB'}]}>Pompiers (197)</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={tw`bg-[#0a7ea4] py-2 px-3 rounded-lg flex-row items-center mb-2 w-[48%]`}
              onPress={() => Linking.openURL('tel:+21671000000')}
            >
              <Ionicons name="car" size={18} color="white" style={tw`mr-1`} />
              <Text style={[tw`text-white font-[OutfitM]`,{fontFamily:'OutfitB'}]}>Assistance</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#0a7ea4" style={tw`mt-10`} />
      ) : constats.length === 0 ? (
        <View style={tw`flex-1 justify-center items-center`}>
                <Text style={[tw`text-lg text-gray-500 font-[OutfitM] mb-2`,{fontFamily:'OutfitB'}]}>Aucun constat trouvé</Text>
          <Text style={[tw`text-gray-400 font-[OutfitR] text-center`,{fontFamily:'OutfitB'}]}>
            Créez votre premier constat en appuyant sur le bouton + ci-dessous
          </Text>
        </View>
      ) : (
        <FlatList
          data={constats}
          renderItem={renderConstatItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw`px-4 pb-20`}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#0a7ea4"]}
              tintColor="#0a7ea4"
            />
          }
        />
      )}
      
      <TouchableOpacity 
        style={tw`absolute bottom-6 right-6 bg-[#0a7ea4] w-16 h-16 rounded-full justify-center items-center shadow-lg`}
        onPress={navigateToCreateConstat}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
