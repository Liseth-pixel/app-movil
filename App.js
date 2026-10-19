import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { supabase } from './lib/supabase';
import LoginScreen from './screens/LoginScreen';
import InicioScreen from './screens/InicioScreen';

export default function App() {
  const [sesion, setSesion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [aviso, setAviso] = useState('');

  // 1. Obtener sesión actual de Supabase y escuchar cambios de estado
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

  // Mientras se verifica la sesión en Supabase
  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  // Si no hay usuario logueado, mostrar el Login
  if (!sesion) {
    return (
      <>
        <StatusBar style="dark" />
        <LoginScreen aviso={aviso} setAviso={setAviso} />
      </>
    );
  }

  // Si hay usuario logueado, mostrar el inicio del Estudiante con su QR e historial
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