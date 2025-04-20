import React from "react";
import {
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";

interface GoogleLoginButtonProps {
  type?: "login" | "register";
}

/**
 * Botón para iniciar sesión con Google utilizando expo-auth-session
 */
export default function GoogleLoginButton({
  type = "login",
}: GoogleLoginButtonProps) {
  const { loginWithGoogle, isLoading, error } = useGoogleAuth();

  const buttonText =
    type === "login" ? "Continuar con Google" : "Registrarse con Google";

  return (
    <TouchableOpacity
      style={styles.googleButton}
      onPress={loginWithGoogle}
      disabled={isLoading}
      accessibilityLabel={buttonText}
      accessibilityRole="button"
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#4285F4" />
      ) : (
        <>
          <Image
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg",
            }}
            style={styles.googleIcon}
          />
          <Text style={styles.googleButtonText}>{buttonText}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: "#ddd",
    width: "100%",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
    marginVertical: 10,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  googleButtonText: {
    color: "#757575",
    fontSize: 16,
    fontWeight: "500",
  },
});
