import React from 'react';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import { ThemeProvider } from 'styled-components/native';
import theme from './src/global/styles/theme';
import AppLoading from 'expo-app-loading';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Routes } from './src/routes';
import { StatusBar } from 'react-native';
import { AuthProvider, useAuth } from './src/hooks/auth';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  const { isLoading } = useAuth();

  if (!fontsLoaded || isLoading) {
    return <AppLoading />
  }

  return (
    <ThemeProvider theme={theme}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent></StatusBar>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ThemeProvider>
  );
}
