import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { supabase } from './lib/supabase';
import LoginScreen from './screens/LoginScreen';
import InicioScreen from './screens/InicioScreen';
import DocenteInicioScreen from './screens/DocenteInicioScreen';
import EstudiantesScreen from './screens/EstudiantesScreen';
import ProximamenteScreen from './screens/ProximamenteScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [sesion, setSesion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [rol, setRol] = useState(undefined);
  const [aviso, setAviso] = useState('');

  // 1. Verificar sesión de Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSesion(session);
      setCargando(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSesion(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // 2. Verificar el rol del usuario logueado
  useEffect(() => {
    if (!sesion) {
      setRol(undefined);
      return;
    }

    setCargando(true);
    supabase
      .from('profiles')
      .select('rol')
      .eq('id', sesion.user.id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error('Error al obtener el rol:', error.message);
          setRol('estudiante');
        } else {
          setRol(data ? data.rol : 'estudiante');
        }
        setCargando(false);
      });
  }, [sesion]);

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  // Si no hay sesión iniciada, mostrar el Login
  if (!sesion) {
    return (
      <>
        <StatusBar style="dark" />
        <LoginScreen aviso={aviso} setAviso={setAviso} />
      </>
    );
  }

  // Si el usuario es Docente, usamos la Navegación Stack
  if (rol === 'docente') {
    return (
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator>
          <Stack.Screen name="Inicio" options={{ headerShown: false }}>
            {(props) => <DocenteInicioScreen {...props} sesion={sesion} />}
          </Stack.Screen>
          <Stack.Screen 
            name="Estudiantes" 
            component={EstudiantesScreen} 
            options={{ title: 'Gestión de Estudiantes' }}
          />
          <Stack.Screen 
            name="Escanear" 
            component={ProximamenteScreen} 
            options={{ title: 'Escanear QR' }}
          />
          <Stack.Screen 
            name="Asistencia" 
            component={ProximamenteScreen} 
            options={{ title: 'Registro de Asistencia' }}
          />
          <Stack.Screen 
            name="Reportes" 
            component={ProximamenteScreen} 
            options={{ title: 'Reportes' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  // Si es Estudiante
  return (
    <>
      <StatusBar style="dark" />
      <InicioScreen sesion={sesion} />
    </>
  );
}

const styles = StyleSheet.create({
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
});