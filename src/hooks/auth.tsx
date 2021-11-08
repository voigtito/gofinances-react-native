import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthProviderProps {
  children: ReactNode;
}

interface IAuthContextData {
  user: User;
  signInWithGoogle(): Promise<void>
  signInWithApple(): Promise<void>
  signOut(): Promise<void>
  isLoading: boolean;
}

interface AuthorizationResponse {
  params: {
    access_token: string;
  };
  type: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

export const AuthContext = createContext({} as IAuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {

  const [user, setUser] = useState<User>({} as User);
  const [isLoading, setIsLoading] = useState(true);

  const userStorageKey = '@gofinances:user'

  async function signInWithGoogle() {
    try {
      const RESPONSE_TYPE = "token";
      const SCOPE = encodeURI('profile email');
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

      const { params, type } = await AuthSession.startAsync({ authUrl }) as AuthorizationResponse;

      if (type === "success") {
        const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`)
        const userInfo = await response.json();
        const userLogged = {
          id: String(userInfo.id),
          email: userInfo.email!,
          name: userInfo.given_name!,
          picture: userInfo.picture!
        }
        setUser(userLogged)
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
      }

    } catch (error) {
      console.log(error)
    }
  }

  async function signInWithApple() {
    try {
      const credentials = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ]
      })

      if (credentials) {
        const name = credentials.fullName!.givenName!;
        const userLogged = {
          id: String(credentials.user),
          email: credentials.user!,
          name,
          photo: `https://ui-avatars.com/api?name=${name}&length=1`
        }

        setUser(userLogged);
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
      }

    } catch (error) {
      console.log(error)
    }
  }

  async function signOut() {
    setUser({} as User);
    await AsyncStorage.removeItem(userStorageKey);
  }

  useEffect(() => {
    async function loadStorageData() {
      const userStoraged = await AsyncStorage.getItem(userStorageKey);

      if (userStoraged) {
        const userLogged = JSON.parse(userStoraged) as User;
        setUser(userLogged);
      }
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      signInWithGoogle,
      signInWithApple,
      isLoading,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

