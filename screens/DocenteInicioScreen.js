import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../lib/supabase';

const BOTONES = [
  { titulo: 'Escanear QR', icono: '📷', destino: 'Escanear' },
  { titulo: 'Estudiantes', icono: '👩‍🎓', destino: 'Estudiantes' },
  { titulo: 'Asistencia', icono: '📋', destino: 'Asistencia' },
  { titulo: 'Reportes', icono: '📊', destino: 'Reportes' },
];

export default function DocenteInicioScreen({ navigation, sesion }) {
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    supabase
      .from('docentes')
      .select('nombre')
      .eq('id', sesion.user.id)
      .single()
      .then(({ data }) => {
        if (data) setNombre(data.nombre);
      });
  }, []);

  const salir = async () => {
    await supabase.auth.signOut();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.saludo}>Hola, {nombre || 'docente'} 👋</Text>
      <Text style={styles.subtitulo}>¿Qué quieres hacer hoy?</Text>

      <View style={styles.rejilla}>
        {BOTONES.map((b) => (
          <Pressable
            key={b.destino}
            style={styles.tarjeta}
            onPress={() => navigation.navigate(b.destino)}
          >
            <Text style={styles.icono}>{b.icono}</Text>
            <Text style={styles.tarjetaTexto}>{b.titulo}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.salir} onPress={salir}>
        <Text style={styles.salirTexto}>Cerrar sesión</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 20,
    paddingTop: 70,
  },
  saludo: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  subtitulo: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 28,
  },
  rejilla: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tarjeta: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 28,
    alignItems: 'center',
    marginBottom: 16,
  },
  icono: {
    fontSize: 36,
    marginBottom: 10,
  },
  tarjetaTexto: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  salir: {
    marginTop: 'auto',
    marginBottom: 40,
    alignItems: 'center',
    paddingVertical: 14,
  },
  salirTexto: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 16,
  },
});