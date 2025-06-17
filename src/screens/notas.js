import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Card, Button, Text, FAB } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Notes({ navigation }) {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadNotes);
    return unsubscribe;
  }, [navigation]);

  async function loadNotes() {
    const data = await AsyncStorage.getItem('notes');
    setNotes(data ? JSON.parse(data) : []);
  }

  function confirmDelete(id) {
    Alert.alert('Excluir', 'Deseja excluir esta anotação?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', onPress: () => deleteNote(id) },
    ]);
  }

  async function deleteNote(id) {
    const newNotes = notes.filter((n) => n.id !== id);
    await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
    setNotes(newNotes);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title title={item.name} subtitle={item.platform} />
            <Card.Content>
              <Text>Descrição: {item.description}</Text>
              <Text>Data: {item.date}</Text>
              <Text>Nota: {item.rating}</Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => navigation.navigate('NoteForm', { note: item })}>
                Editar
              </Button>
              <Button onPress={() => confirmDelete(item.id)} textColor="red">
                Excluir
              </Button>
            </Card.Actions>
          </Card>
        )}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('NoteForm')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  card: { marginBottom: 10 },
  fab: { position: 'absolute', right: 16, bottom: 16 },
});
