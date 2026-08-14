import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginWithGoogle, fetchCurrentUser } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('nexa_auth_token'));
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Check if first-time visitor to trigger login prompt modal automatically
  useEffect(() => {
    async function initAuth() {
      const savedToken = localStorage.getItem('nexa_auth_token');
      if (savedToken) {
        try {
          const profile = await fetchCurrentUser();
          setUser(profile);
        } catch (err) {
          console.warn('Session expired or invalid:', err);
          logout();
        }
      } else {
        // If user has never visited or dismissed the first-time modal, show it
        const hasVisited = localStorage.getItem('nexa_visited_before');
        if (!hasVisited) {
          setIsAuthModalOpen(true);
        }
      }
      setLoading(false);
    }
    initAuth();
  }, []);

  const refreshUser = async () => {
    const savedToken = localStorage.getItem('nexa_auth_token');
    if (savedToken) {
      try {
        const profile = await fetchCurrentUser();
        setUser(profile);
      } catch (err) {
        console.warn('Failed to refresh user profile:', err);
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;
      if (!credential) throw new Error('No credential received from Google');

      const data = await loginWithGoogle(credential);
      localStorage.setItem('nexa_auth_token', data.token);
      localStorage.setItem('nexa_visited_before', 'true');
      setToken(data.token);
      setUser(data.user);
      setIsAuthModalOpen(false);
      return data.user;
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const handleCloseModal = () => {
    localStorage.setItem('nexa_visited_before', 'true');
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    localStorage.removeItem('nexa_auth_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: handleCloseModal,
        handleGoogleSuccess,
        refreshUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
