import { useEffect } from 'react';
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    // Handle the OAuth callback
    const handleOAuthCallback = async () => {
      try {
        if (params.access_token) {
          await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
          });
          
          router.replace('/');
        }
      } catch (error) {
        console.error('Error handling OAuth callback:', error);
        router.replace('/auth/login');
      }
    };

    handleOAuthCallback();
  }, [params, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0a7ea4" />
      <Text style={styles.text}>Completing login...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    fontFamily: 'OutfitR',
  },
}); 