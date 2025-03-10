import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator, Text } from 'react-native';
import { useUser } from '@/context/UsersContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Esta pantalla sirve como ruta de índice para el directorio (dashboard),
 * lo que resuelve el error "No route named index exists".
 * 
 * Simplemente redirige al usuario a la pantalla principal del dashboard.
 */
export default function DashboardIndexScreen() {
  const { user } = useUser();
  const [checking, setChecking] = useState(true);
  
  // Verificar el estado de autenticación y tokens al cargar
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('@token');
        console.log('Token en índice de dashboard:', token ? 'Existe' : 'No existe');
        setChecking(false);
      } catch (err) {
        console.error('Error verificando token en pantalla de índice:', err);
        setChecking(false);
      }
    };
    
    checkStatus();
  }, []);
  
  // Si está cargando, mostrar un indicador
  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
        <ActivityIndicator size="large" color="#6842FF" />
        <Text style={{ marginTop: 10, color: 'white' }}>Cargando...</Text>
      </View>
    );
  }
  
  // Si no está autenticado, redirigir a login
  if (!user) {
    console.log('No autenticado en índice, redirigiendo a login');
    return <Redirect href="/login" />;
  }
  
  // Si está autenticado, redirigir a la pantalla de inicio
  console.log('Autenticado en índice, redirigiendo a home');
  return <Redirect href="/(dashboard)" />;
} 