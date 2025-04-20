// app/(usuario)/login.tsx

import React, { useState } from "react";
import { useRouter } from "expo-router";

// Hooks personalizados
import { useEmailAuth } from "../../hooks/useEmailAuth";
import { useOAuthLogin } from "../../hooks/useOAuthLogin";

// Componentes
import AuthLayout from "../../components/auth/AuthLayout";
import AuthHeader from "../../components/auth/AuthHeader";
import LoginForm from "../../components/auth/LoginForm";
import SocialLoginSection from "../../components/auth/SocialLoginSection";
import AuthFooter from "../../components/auth/AuthFooter";

export default function LoginScreen() {
  const router = useRouter();

  // Estado para controlar qué método de autenticación de Google usar
  const [useNativeGoogleAuth, setUseNativeGoogleAuth] = useState(true);

  // Hook para autenticación por email/contraseña
  const {
    email,
    setEmail,
    password,
    setPassword,
    remember,
    showPassword,
    isLoading: emailAuthLoading,
    error: emailAuthError,
    setError: setEmailAuthError,
    handleLogin,
    togglePasswordVisibility,
    toggleRemember,
  } = useEmailAuth();

  // Hook para autenticación con proveedores OAuth (para Facebook y Apple)
  const {
    handleGoogleLogin,
    handleFacebookLogin,
    handleAppleLogin,
    isLoading: oauthLoading,
    error: oauthError,
    setError: setOAuthError,
  } = useOAuthLogin();

  // Determinar si algún proceso de autenticación está en curso
  const isLoading = emailAuthLoading || oauthLoading;

  // Determinar qué error mostrar (prioriza el último)
  const error = oauthError || emailAuthError;

  // Limpiar errores al cambiar entre métodos
  const handleOAuthPress = (method: "google" | "facebook" | "apple") => {
    setEmailAuthError("");

    switch (method) {
      case "google":
        handleGoogleLogin();
        break;
      case "facebook":
        handleFacebookLogin();
        break;
      case "apple":
        handleAppleLogin();
        break;
    }
  };

  return (
    <AuthLayout>
      <AuthHeader
        title="Bienvenido de vuelta"
        subtitle="Ingresa con tu cuenta para continuar"
      />

      <LoginForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        remember={remember}
        toggleRemember={toggleRemember}
        showPassword={showPassword}
        togglePasswordVisibility={togglePasswordVisibility}
        error={error}
        isLoading={isLoading}
        onSubmit={handleLogin}
      />

      <SocialLoginSection
        onFacebookPress={() => handleOAuthPress("facebook")}
        onGooglePress={() => handleOAuthPress("google")}
        onApplePress={() => handleOAuthPress("apple")}
        type="login"
        useNativeGoogleAuth={useNativeGoogleAuth}
      />

      <AuthFooter
        prompt="¿No tienes una cuenta?"
        actionText="Regístrate"
        onPress={() => router.push("/(usuario)/register")}
        accessibilityLabel="Ir a registro"
      />
    </AuthLayout>
  );
}
