import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
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

function Cargando() {
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}

export default function App() {
  const [sesion, setSesion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [rol, setRol] = useState(undefined);
  const [aviso, setAviso] = useState('');

  // 1. Saber si hay una sesión iniciada
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSesion(data.session);
      setCargando(false);
    });

    const { data: oyente } = supabase.auth.onAuthStateChange(
      (_evento, nuevaSesion) => {
        setSesion(nuevaSesion);
      }
    );

    return () => oyente.subscription.unsubscribe();
  }, []);

  // 2. Si hay sesión, averiguar si es docente o estudiante
  useEffect(() => {
    if (!sesion) {
      setRol(undefined);
      return;
    }
    setRol(undefined);
    supabase
      .from('profiles')
      .select('rol')
      .eq('id', sesion.user.id)
      .single()
      .then(({ data }) => {
        setRol(data ? data.rol : 'ninguno');
      });
  }, [sesion]);

  if (cargando) return <Cargando />;

  if (!sesion) {
    return (
      <>
        <StatusBar style="dark" />
        <LoginScreen aviso={aviso} setAviso={setAviso} />
      </>
    );
  }

  if (rol === undefined) return <Cargando />;

  if (rol === 'docente') {
    return (
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator>
          <Stack.Screen name="Inicio" options={{ headerShown: false }}>
            {(props) => <DocenteInicioScreen {...props} sesion={sesion} />}
          </Stack.Screen>
          <Stack.Screen name="Escanear" component={ProximamenteScreen} />
          <Stack.Screen name="Estudiantes" component={EstudiantesScreen} />
          <Stack.Screen name="Asistencia" component={ProximamenteScreen} />
          <Stack.Screen name="Reportes" component={ProximamenteScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  // Estudiante (pantalla temporal)
  return (
    <>
      <StatusBar style="dark" />
      <InicioScreen sesion={sesion} />
    </>
  );
}