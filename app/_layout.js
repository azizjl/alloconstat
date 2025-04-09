import { useFonts } from 'expo-font';
import {
  Outfit_300Light as OutfitL,
  Outfit_400Regular as OutfitR,
  Outfit_500Medium as OutfitM,
  Outfit_600SemiBold as OutfitB,
} from "@expo-google-fonts/outfit";
import { Stack, Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { user, loading, initialize } = useAuthStore();

  const [loaded] = useFonts({
    OutfitL,
    OutfitR,
    OutfitM,
    OutfitB,
  });

  useEffect(() => {
    // Initialize auth state
    const subscription = initialize();
    
    // Cleanup subscription on unmount
    return () => {
      subscription.then(sub => sub?.unsubscribe());
    };
  }, []);

  useEffect(() => {
    if (loaded && !loading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, loading]);

  if (!loaded || loading) {
    return null;
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return (
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="auth/login" options={{ title: 'Login' }} />
          <Stack.Screen name="auth/register" options={{ title: 'Register' }} />
          <Stack.Screen name="auth/callback" options={{ title: 'Auth Callback' }} />
          <Stack.Screen name="CreateConstat" options={{ title: 'Create Constat' }} />
          <Stack.Screen name="ConstatDetail" options={{ title: 'Constat Detail' }} />
          <Stack.Screen name="EditConstat" options={{ title: 'Edit Constat' }} />
          <Stack.Screen 
            name="index" 
            redirect 
            options={{
              href: null,
            }} 
          />
        </Stack>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    );
  }

  // If user is authenticated
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        {/* <Stack.Screen name="CreateConstat" options={{ title: 'Create Constat' }} /> */}
        <Stack.Screen name="NewCreateConstat" options={{ title: 'Create Constat' }} />
        <Stack.Screen name="ConstatDetail" options={{ title: 'Constat Detail' }} />
        <Stack.Screen name="EditConstat" options={{ title: 'Edit Constat' }} />
        <Stack.Screen 
          name="auth/login" 
          redirect 
          options={{
            href: null,
          }} 
        />
        <Stack.Screen 
          name="auth/register" 
          redirect 
          options={{
            href: null,
          }} 
        />
        <Stack.Screen name="auth/callback" options={{ title: 'Auth Callback' }} />
      </Stack>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
