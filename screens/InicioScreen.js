import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function InicioScreen({ sesion }) {
  const [rol, setRol] = useState('...');

  useEffect(() => {
    supabase
      .from('profiles')
      .select('rol')
      .eq('id', sesion.user.id)
      .single()
      .then(({ data }) => {
        if (data) setRol(data.rol);
      });
  }, []);

  const salir = async () => {
    await supabase.auth.signOut();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>¡Sesión iniciada! ✅</Text>
      <Text style={styles.texto}>Correo: {sesion.user.email}</Text>
      <Text style={styles.texto}>Rol: {rol}</Text>

      <Pressable style={styles.boton} onPress={salir}>
        <Text style={styles.botonTexto}>Cerrar sesión</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E3A8A',
    marginBottom: 16,
  },
  texto: {
    fontSize: 16,
    color: '#334155',
    marginBottom: 6,
  },
  boton: {
    backgroundColor: '#DC2626',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 28,
    marginTop: 24,
  },
  botonTexto: {
    color: '#fff',
    fontWeight: '700',
  },
});