import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function EstudiantesScreen() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [carnet, setCarnet] = useState('');
  const [grado, setGrado] = useState('');
  const [seccion, setSeccion] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const guardar = async () => {
    const estudiante = {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      carnet: carnet.trim(),
      grado: grado.trim(),
      seccion: seccion.trim(),
    };

    if (Object.values(estudiante).some((valor) => !valor)) {
      setMensaje('Completa todos los campos antes de guardar.');
      return;
    }

    setGuardando(true);
    setMensaje('');

    try {
      const { error } = await supabase.from('estudiantes').insert(estudiante);

      if (error) {
        setMensaje(`No se pudo guardar el estudiante: ${error.message}`);
        return;
      }

      setMensaje('Estudiante guardado correctamente.');
      setNombre('');
      setApellido('');
      setCarnet('');
      setGrado('');
      setSeccion('');
    } catch (error) {
      const detalle =
        error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
      setMensaje(`No se pudo guardar el estudiante: ${detalle}`);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.contenedorTeclado} behavior="padding">
      <ScrollView
        contentContainerStyle={styles.contenedor}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.titulo}>Registrar estudiante</Text>

        <Text style={styles.etiqueta}>Nombre</Text>
        <TextInput
          style={styles.campo}
          placeholder="Escribe el nombre"
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={styles.etiqueta}>Apellido</Text>
        <TextInput
          style={styles.campo}
          placeholder="Escribe el apellido"
          value={apellido}
          onChangeText={setApellido}
        />

        <Text style={styles.etiqueta}>Carnet</Text>
        <TextInput
          style={styles.campo}
          placeholder="Escribe el carnet"
          value={carnet}
          onChangeText={setCarnet}
        />

        <Text style={styles.etiqueta}>Grado</Text>
        <TextInput
          style={styles.campo}
          placeholder="Escribe el grado"
          value={grado}
          onChangeText={setGrado}
        />

        <Text style={styles.etiqueta}>Sección</Text>
        <TextInput
          style={styles.campo}
          placeholder="Escribe la sección"
          value={seccion}
          onChangeText={setSeccion}
        />

        {mensaje ? <Text style={styles.mensaje}>{mensaje}</Text> : null}

        <Pressable
          style={[styles.boton, guardando && styles.botonDeshabilitado]}
          onPress={guardar}
          disabled={guardando}
        >
          <Text style={styles.textoBoton}>
            {guardando ? 'Guardando...' : 'Guardar estudiante'}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contenedorTeclado: {
    flex: 1,
  },
  contenedor: {
    flexGrow: 1,
    backgroundColor: '#F8FAFC',
    padding: 20,
  },
  titulo: {
    color: '#1E3A8A',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 24,
  },
  etiqueta: {
    color: '#1E293B',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  campo: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  boton: {
    alignItems: 'center',
    backgroundColor: '#1E3A8A',
    borderRadius: 10,
    marginTop: 8,
    paddingVertical: 15,
  },
  botonDeshabilitado: {
    opacity: 0.7,
  },
  mensaje: {
    color: '#1E293B',
    fontSize: 14,
    marginBottom: 12,
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
