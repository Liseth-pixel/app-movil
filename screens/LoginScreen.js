import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function LoginScreen({ aviso, setAviso }) {
  const [carnet, setCarnet] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);

  const iniciarSesion = async () => {
    const identificador = carnet.trim();
    if (!identificador || !contrasena) {
      setAviso('Ingresa tu carnet y contraseña.');
      return;
    }

    const email = identificador.includes('@')
      ? identificador
      : `${identificador}@qresente.app`;

    setAviso('');
    setCargando(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: contrasena,
      });

      if (error) setAviso(error.message);
    } catch {
      setAviso('No se pudo iniciar sesión. Verifica tu conexión e inténtalo de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>QRESENTE</Text>
      <Text style={styles.subtitulo}>Inicia sesión para continuar</Text>

      <TextInput
        style={styles.input}
        value={carnet}
        onChangeText={setCarnet}
        placeholder="Carnet"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        editable={!cargando}
      />
      <TextInput
        style={styles.input}
        value={contrasena}
        onChangeText={setContrasena}
        placeholder="Contraseña"
        secureTextEntry
        editable={!cargando}
      />

      {aviso ? <Text style={styles.aviso}>{aviso}</Text> : null}

      <Pressable
        style={[styles.boton, cargando && styles.botonDeshabilitado]}
        onPress={iniciarSesion}
        disabled={cargando}
      >
        {cargando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.textoBoton}>Iniciar sesión</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F8FAFC',
  },
  titulo: {
    color: '#1E3A8A',
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitulo: {
    color: '#64748B',
    fontSize: 16,
    marginBottom: 28,
    marginTop: 8,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#CBD5E1',
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  aviso: {
    color: '#B91C1C',
    marginBottom: 12,
  },
  boton: {
    alignItems: 'center',
    backgroundColor: '#1E3A8A',
    borderRadius: 10,
    justifyContent: 'center',
    minHeight: 48,
    marginTop: 4,
  },
  botonDeshabilitado: {
    opacity: 0.7,
  },
  textoBoton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
