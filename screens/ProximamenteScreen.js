import { StyleSheet, Text, View } from 'react-native';

export default function ProximamenteScreen({ route }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icono}>🚧</Text>
      <Text style={styles.titulo}>{route.name}</Text>
      <Text style={styles.texto}>
        Esta pantalla la construiremos en un próximo paso.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  icono: {
    fontSize: 48,
    marginBottom: 12,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E3A8A',
    marginBottom: 8,
  },
  texto: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
  },
});