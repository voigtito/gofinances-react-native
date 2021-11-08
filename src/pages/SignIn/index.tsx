import React, { useContext, useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';

import LogoSvg from '../../assets/logo.svg';
import GoogleSvg from '../../assets/google.svg';
import AppleSvg from '../../assets/apple.svg';

import { SignInSocialButton } from '../../components/SignInSocialButton';

import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper
} from './styles'
import { useAuth } from '../../hooks/auth';
import { ActivityIndicator, Platform } from 'react-native';
import { useTheme } from 'styled-components';

export function SignIn() {

  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle, signInWithApple } = useAuth();
  const { colors } = useTheme();

  async function handleSignInWithGoogle() {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  async function handleSignInWithApple() {
    try {
      setIsLoading(true);
      await signInWithApple();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg
            width={RFValue(120)}
            height={RFValue(68)}
          />
          <Title>Controle suas {'\n'} finanças de forma {'\n'} muito simples</Title>
        </TitleWrapper>
        <SignInTitle>
          Faça seu login com {'\n'} uma das contas abaixo
        </SignInTitle>
      </Header>
      <Footer>
        {isLoading ?
          <ActivityIndicator color={colors.shape} size="large" />
          :
          <FooterWrapper>
            <SignInSocialButton title="Entrar com Google" svg={GoogleSvg} onPress={handleSignInWithGoogle}></SignInSocialButton>
            {Platform.OS === "ios" && <SignInSocialButton title="Entrar com Apple" svg={AppleSvg} onPress={handleSignInWithApple}></SignInSocialButton>}
          </FooterWrapper>
        }
      </Footer>
    </Container>
  )
}