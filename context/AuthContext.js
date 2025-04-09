import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

// Initialize WebBrowser for OAuth
WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Email/password sign in
  const signInWithEmail = async (email, password) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Email/password sign up
  const signUpWithEmail = async (email, password) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing up:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Google sign in
  const signInWithGoogle = async () => {
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
  };

  // Facebook sign in
  const signInWithFacebook = async () => {
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
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signInWithFacebook,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
} 