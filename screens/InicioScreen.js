import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  FlatList,
  ActivityIndicator,
} from 'react-native';
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

  // Extraemos el carnet o identificador limpio del correo o metadatos
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

      {/* Tarjeta con el Código QR (Simulado visualmente o listo para librería QR) */}
      <View style={styles.cardQR}>
        <Text style={styles.cardTitle}>Tu Código QR de Asistencia</Text>
        <View style={styles.qrBox}>
          {/* Aquí puedes integrar luego una librería de QR si lo deseas */}
          <Text style={styles.qrTextoSimulado}>[ QR: {identificador} ]</Text>
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
    marginBottom: 20,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  subtitulo: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 5,
  },
  bienvenida: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
  },
  cardQR: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 12,
  },
  qrBox: {
    width: 160,
    height: 160,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    marginBottom: 12,
  },
  qrTextoSimulado: {
    fontWeight: 'bold',
    color: '#475569',
    textAlign: 'center',
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
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  seccionTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 12,
  },
  sinAsistencias: {
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 20,
  },
  itemAsistencia: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  itemMateria: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  itemFecha: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  botonCerrar: {
    backgroundColor: '#DC2626',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  textoBotonCerrar: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});