import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

// Initialize WebBrowser for OAuth
WebBrowser.maybeCompleteAuthSession();

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  
  // Initialize the auth state
  initialize: async () => {
    try {
      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      set({ user: session?.user || null, loading: false });
      
      // Listen for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        set({ user: session?.user || null });
      });
      
      // Return the subscription for cleanup
      return subscription;
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ loading: false });
    }
  },
  
  // Email/password sign in
  signInWithEmail: async (email, password) => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in:', error.message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  
  // Email/password sign up
  signUpWithEmail: async (email, password) => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing up:', error.message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  
  // Google sign in
  signInWithGoogle: async () => {
    try {
      const redirectUrl = AuthSession.makeRedirectUri({ path: 'auth/callback' });
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });
      
      if (error) throw error;
      
      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
        if (result.type === 'success') {
          const { url } = result;
          await supabase.auth.setSession({
            access_token: url.split('access_token=')[1].split('&')[0],
          });
        }
      }
    } catch (error) {
      console.error('Error signing in with Google:', error.message);
      throw error;
    }
  },
  
  // Facebook sign in
  signInWithFacebook: async () => {
    try {
      const redirectUrl = AuthSession.makeRedirectUri({ path: 'auth/callback' });
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: redirectUrl,
        },
      });
      
      if (error) throw error;
      
      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
        if (result.type === 'success') {
          const { url } = result;
          await supabase.auth.setSession({
            access_token: url.split('access_token=')[1].split('&')[0],
          });
        }
      }
    } catch (error) {
      console.error('Error signing in with Facebook:', error.message);
      throw error;
    }
  },
  
  // Sign out
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error.message);
      throw error;
    }
  },
})); 