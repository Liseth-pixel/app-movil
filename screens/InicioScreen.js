import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { supabase } from '../lib/supabase';

export default function InicioScreen({ sesion }) {
  const [perfil, setPerfil] = useState(null);
  const [asistencias, setAsistencias] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatosEstudiante();
  }, []);

  const cargarDatosEstudiante = async () => {
    try {
      // 1. Obtener los datos del perfil del estudiante actual
      const { data: datosPerfil, error: errorPerfil } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sesion.user.id)
        .single();

      if (errorPerfil) throw errorPerfil;
      setPerfil(datosPerfil);

      // 2. Obtener el historial de asistencias de este estudiante
      const { data: datosAsistencias, error: errorAsistencias } = await supabase
        .from('asistencias')
        .select('*')
        .eq('student_id', sesion.user.id)
        .order('created_at', { ascending: false });

      if (errorAsistencias) throw errorAsistencias;
      setAsistencias(datosAsistencias || []);
    } catch (error) {
      console.error('Error al cargar datos:', error.message);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.textoCargando}>Cargando tu información...</Text>
      </View>
    );
  }

  // Extraemos el identificador o carnet para el código QR
  const identificador = perfil?.carnet || sesion.user.email.split('@')[0];

  return (
    <View style={styles.container}>
      {/* Encabezado de Bienvenida */}
      <View style={styles.header}>
        <Text style={styles.titulo}>QRESENTE</Text>
        <Text style={styles.subtitulo}>Panel de Estudiante</Text>
        <Text style={styles.bienvenida}>
          Hola, {perfil?.nombre_completo || identificador}
        </Text>
      </View>

      {/* Tarjeta con el Código QR Real */}
      <View style={styles.cardQR}>
        <Text style={styles.cardTitle}>Tu Código QR de Asistencia</Text>
        <View style={styles.qrBox}>
          <QRCode
            value={identificador}
            size={150}
            color="#1E3A8A"
            backgroundColor="#FFFFFF"
          />
        </View>
        <Text style={styles.qrInstruccion}>
          Muestra este código al docente para registrar tu asistencia.
        </Text>
      </View>

      {/* Historial de Asistencias */}
      <View style={styles.seccionHistorial}>
        <Text style={styles.seccionTitulo}>Tus Asistencias Registradas</Text>
        {asistencias.length === 0 ? (
          <Text style={styles.sinAsistencias}>
            Aún no tienes asistencias registradas.
          </Text>
        ) : (
          <FlatList
            data={asistencias}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.itemAsistencia}>
                <Text style={styles.itemMateria}>
                  {item.materia || 'Asistencia General'}
                </Text>
                <Text style={styles.itemFecha}>
                  {new Date(item.created_at).toLocaleDateString()} -{' '}
                  {new Date(item.created_at).toLocaleTimeString()}
                </Text>
              </View>
            )}
          />
        )}
      </View>

      {/* Botón de Cerrar Sesión */}
      <Pressable
        style={styles.botonCerrar}
        onPress={() => supabase.auth.signOut()}
      >
        <Text style={styles.textoBotonCerrar}>Cerrar sesión</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 20,
    paddingTop: 40,
  },
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  textoCargando: {
    marginTop: 10,
    color: '#64748B',
  },
  header: {
    marginBottom: 15,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  subtitulo: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 3,
  },
  bienvenida: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  cardQR: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 10,
  },
  qrBox: {
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  qrInstruccion: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  seccionHistorial: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  seccionTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 10,
  },
  sinAsistencias: {
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 20,
  },
  itemAsistencia: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  itemMateria: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  itemFecha: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  botonCerrar: {
    backgroundColor: '#DC2626',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  textoBotonCerrar: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
});