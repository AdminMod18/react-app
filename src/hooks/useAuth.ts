import { useState, useEffect } from 'react';

type UserType = 'advisor' | 'client' | null;

interface UserData {
  name: string;
  email?: string;
  role?: string;
  id?: string;
  documentNumber?: string;
  contractNumber?: string;
  phone?: string;
}

interface AuthState {
  userType: UserType;
  userData: UserData | null;
  isAuthenticated: boolean;
}

const AUTH_STORAGE_KEY = 'bpms_auth_state';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Intentar recuperar el estado de autenticación del localStorage
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          userType: parsed.userType,
          userData: parsed.userData,
          isAuthenticated: !!parsed.userData,
        };
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
    }
    
    return {
      userType: null,
      userData: null,
      isAuthenticated: false,
    };
  });

  // Guardar el estado en localStorage cuando cambie
  useEffect(() => {
    if (authState.userData) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
        userType: authState.userType,
        userData: authState.userData,
      }));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [authState]);

  const login = (type: UserType, data: UserData) => {
    setAuthState({
      userType: type,
      userData: data,
      isAuthenticated: true,
    });
  };

  const logout = () => {
    setAuthState({
      userType: null,
      userData: null,
      isAuthenticated: false,
    });
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return {
    ...authState,
    login,
    logout,
  };
}
