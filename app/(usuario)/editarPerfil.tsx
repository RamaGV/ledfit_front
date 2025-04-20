// app/(usuario)/editarPerfil.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";

import { useUser } from "../../context/UsersContext";
import TopNavbar from "../../components/TopNavbar";

export default function EditarPerfilScreen() {
  const router = useRouter();
  const { user, updateUserProfile, updatePassword } = useUser();

  // Estados para los campos del formulario
  const [nombre, setNombre] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [imagenPerfil, setImagenPerfil] = useState(
    "https://randomuser.me/api/portraits/women/32.jpg",
  );
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estados para manejo de UI
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("info"); // 'info' o 'password'

  // Estado para validaciones
  const [errors, setErrors] = useState({
    nombre: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Funciones de validación
  const validateNombre = () => {
    if (nombre.trim().length < 3) {
      setErrors((prev) => ({
        ...prev,
        nombre: "El nombre debe tener al menos 3 caracteres",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, nombre: "" }));
    return true;
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Ingresa un email válido" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, email: "" }));
    return true;
  };

  const validatePasswordFields = () => {
    let isValid = true;

    // Validar contraseña actual
    if (!currentPassword) {
      setErrors((prev) => ({
        ...prev,
        currentPassword: "Ingresa tu contraseña actual",
      }));
      isValid = false;
    } else {
      setErrors((prev) => ({ ...prev, currentPassword: "" }));
    }

    // Validar nueva contraseña
    if (newPassword && newPassword.length < 6) {
      setErrors((prev) => ({
        ...prev,
        newPassword: "La contraseña debe tener al menos 6 caracteres",
      }));
      isValid = false;
    } else {
      setErrors((prev) => ({ ...prev, newPassword: "" }));
    }

    // Validar confirmación
    if (newPassword !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Las contraseñas no coinciden",
      }));
      isValid = false;
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }

    return isValid;
  };

  // Función para seleccionar imagen de la galería
  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImagenPerfil(result.assets[0].uri);
      }
    } catch (error) {
      console.log("No se pudo cargar la imagen. Intenta nuevamente.", error);
      Alert.alert("Error", "No se pudo cargar la imagen. Intenta nuevamente.");
    }
  };

  // Función para tomar foto con la cámara
  const takePhoto = async () => {
    try {
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (cameraPermission.status !== "granted") {
        Alert.alert(
          "Permiso denegado",
          "Necesitamos acceso a la cámara para tomar una foto.",
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImagenPerfil(result.assets[0].uri);
      }
    } catch (error) {
      console.log("No se pudo tomar la foto. Intenta nuevamente.", error);
      Alert.alert("Error", "No se pudo tomar la foto. Intenta nuevamente.");
    }
  };

  // Función para mostrar opciones de imagen
  const showImageOptions = () => {
    Alert.alert("Cambiar foto de perfil", "Selecciona una opción", [
      {
        text: "Tomar foto",
        onPress: takePhoto,
      },
      {
        text: "Elegir de la galería",
        onPress: selectImage,
      },
      {
        text: "Cancelar",
        style: "cancel",
      },
    ]);
  };

  // Función para guardar cambios de información personal
  const handleSaveInfo = async () => {
    // Validar campos
    const isNombreValid = validateNombre();
    const isEmailValid = validateEmail();

    if (!isNombreValid || !isEmailValid) {
      return;
    }

    setIsLoading(true);

    try {
      // Actualizar perfil usando la función del contexto
      await updateUserProfile({
        name: nombre,
        email: email,
        // Si se implementa en el futuro la carga de imágenes:
        // profileImage: imagenPerfil !== "https://randomuser.me/api/portraits/women/32.jpg" ? imagenPerfil : undefined
      });

      Alert.alert(
        "Perfil actualizado",
        "Tu información ha sido actualizada correctamente.",
        [{ text: "OK", onPress: () => router.back() }],
      );
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "No se pudo actualizar tu perfil. Intenta nuevamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cambiar contraseña
  const handleChangePassword = async () => {
    // Validar campos de contraseña
    if (!validatePasswordFields()) {
      return;
    }

    setIsLoading(true);

    try {
      // Actualizar contraseña usando la función del contexto
      await updatePassword(currentPassword, newPassword);

      Alert.alert(
        "Contraseña actualizada",
        "Tu contraseña ha sido actualizada correctamente.",
        [
          {
            text: "OK",
            onPress: () => {
              setCurrentPassword("");
              setNewPassword("");
              setConfirmPassword("");
              router.back();
            },
          },
        ],
      );
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message ||
          "No se pudo actualizar tu contraseña. Verifica tus datos e intenta nuevamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#121212" }}
    >
      <TopNavbar titulo="Editar Perfil" />

      <ScrollView className="flex-1 px-4 pt-4">
        {/* Foto de perfil */}
        <View className="items-center mb-6">
          <View className="relative">
            <Image
              source={{ uri: imagenPerfil }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                borderWidth: 2,
                borderColor: "#6842FF",
              }}
            />
            <TouchableOpacity
              onPress={showImageOptions}
              className="absolute bottom-0 right-0 bg-[#6842FF] p-2 rounded-full"
            >
              <Ionicons name="camera" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={showImageOptions} className="mt-2">
            <Text className="text-[#6842FF] font-medium">Cambiar foto</Text>
          </TouchableOpacity>
        </View>

        {/* Pestañas para navegación entre secciones */}
        <View className="flex-row mb-6 bg-[#1E1E1E] rounded-full p-1">
          <TouchableOpacity
            onPress={() => setActiveSection("info")}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 50,
              backgroundColor:
                activeSection === "info" ? "#6842FF" : "transparent",
            }}
          >
            <Text
              style={{
                color: activeSection === "info" ? "#FFFFFF" : "#9E9E9E",
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              Información
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveSection("password")}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 50,
              backgroundColor:
                activeSection === "password" ? "#6842FF" : "transparent",
            }}
          >
            <Text
              style={{
                color: activeSection === "password" ? "#FFFFFF" : "#9E9E9E",
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              Contraseña
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sección de información personal */}
        {activeSection === "info" && (
          <View>
            <View className="mb-4">
              <Text className="text-white mb-2 font-medium">Nombre</Text>
              <View className="bg-[#1E1E1E] rounded-lg flex-row items-center px-4 border border-[#333333]">
                <Ionicons name="person-outline" size={20} color="#6842FF" />
                <TextInput
                  value={nombre}
                  onChangeText={setNombre}
                  onBlur={validateNombre}
                  placeholder="Tu nombre"
                  placeholderTextColor="#9E9E9E"
                  className="flex-1 py-3 px-2 text-white"
                />
              </View>
              {errors.nombre ? (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.nombre}
                </Text>
              ) : null}
            </View>

            <View className="mb-4">
              <Text className="text-white mb-2 font-medium">Email</Text>
              <View className="bg-[#1E1E1E] rounded-lg flex-row items-center px-4 border border-[#333333]">
                <Ionicons name="mail-outline" size={20} color="#6842FF" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  onBlur={validateEmail}
                  placeholder="Tu email"
                  placeholderTextColor="#9E9E9E"
                  keyboardType="email-address"
                  className="flex-1 py-3 px-2 text-white"
                  autoCapitalize="none"
                />
              </View>
              {errors.email ? (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.email}
                </Text>
              ) : null}
            </View>

            <TouchableOpacity
              onPress={handleSaveInfo}
              disabled={isLoading}
              className="mt-6 mb-8"
            >
              <LinearGradient
                colors={["#6842FF", "#8A6FFF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="py-4 rounded-lg items-center justify-center"
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-white font-bold text-lg">
                    Guardar Cambios
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Sección de cambio de contraseña */}
        {activeSection === "password" && (
          <View>
            <View className="mb-4">
              <Text className="text-white mb-2 font-medium">
                Contraseña actual
              </Text>
              <View className="bg-[#1E1E1E] rounded-lg flex-row items-center px-4 border border-[#333333]">
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#6842FF"
                />
                <TextInput
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Tu contraseña actual"
                  placeholderTextColor="#9E9E9E"
                  secureTextEntry={!showCurrentPassword}
                  className="flex-1 py-3 px-2 text-white"
                />
                <TouchableOpacity
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  <Ionicons
                    name={
                      showCurrentPassword ? "eye-off-outline" : "eye-outline"
                    }
                    size={20}
                    color="#9E9E9E"
                  />
                </TouchableOpacity>
              </View>
              {errors.currentPassword ? (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.currentPassword}
                </Text>
              ) : null}
            </View>

            <View className="mb-4">
              <Text className="text-white mb-2 font-medium">
                Nueva contraseña
              </Text>
              <View className="bg-[#1E1E1E] rounded-lg flex-row items-center px-4 border border-[#333333]">
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#6842FF"
                />
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Nueva contraseña"
                  placeholderTextColor="#9E9E9E"
                  secureTextEntry={!showNewPassword}
                  className="flex-1 py-3 px-2 text-white"
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  <Ionicons
                    name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#9E9E9E"
                  />
                </TouchableOpacity>
              </View>
              {errors.newPassword ? (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.newPassword}
                </Text>
              ) : null}
            </View>

            <View className="mb-4">
              <Text className="text-white mb-2 font-medium">
                Confirmar contraseña
              </Text>
              <View className="bg-[#1E1E1E] rounded-lg flex-row items-center px-4 border border-[#333333]">
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#6842FF"
                />
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirma tu nueva contraseña"
                  placeholderTextColor="#9E9E9E"
                  secureTextEntry={!showConfirmPassword}
                  className="flex-1 py-3 px-2 text-white"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-off-outline" : "eye-outline"
                    }
                    size={20}
                    color="#9E9E9E"
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword ? (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </Text>
              ) : null}
            </View>

            <TouchableOpacity
              onPress={handleChangePassword}
              disabled={isLoading}
              className="mt-6 mb-8"
            >
              <LinearGradient
                colors={["#6842FF", "#8A6FFF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="py-4 rounded-lg items-center justify-center"
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-white font-bold text-lg">
                    Cambiar Contraseña
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
