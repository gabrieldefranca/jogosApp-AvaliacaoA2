import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import {
  TextInput,
  Button,
  HelperText,
  Text,
  Card,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NoteForm({ route, navigation }) {
  const note = route.params?.note;
  const [name, setName] = useState(note ? note.name : '');
  const [description, setDescription] = useState(note ? note.description : '');
  const [platform, setPlatform] = useState(note ? note.platform : '');
  const [date, setDate] = useState(note ? note.date : '');
  const [rating, setRating] = useState(note ? String(note.rating) : '');

  function validate() {
    if (!name || !description || !platform || !date || !rating) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return false;
    }
    if (Number(rating) < 0 || Number(rating) > 10) {
      Alert.alert('Erro', 'Nota deve ser entre 0 e 10');
      return false;
    }
    return true;
  }

  async function saveNote() {
    if (!validate()) return;
    const data = await AsyncStorage.getItem('notes');
    const notes = data ? JSON.parse(data) : [];

    if (note) {
      const updated = notes.map((n) => (n.id === note.id ? {
        id: note.id, name, description, platform, date, rating
      } : n));
      await AsyncStorage.setItem('notes', JSON.stringify(updated));
    } else {
      const newNote = {
        id: Date.now(),
        name,
        description,
        platform,
        date,
        rating,
      };
      await AsyncStorage.setItem('notes', JSON.stringify([...notes, newNote]));
    }
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <TextInput label="Nome do Jogo" value={name} onChangeText={setName} style={styles.input} />
          <TextInput label="Descrição" value={description} onChangeText={setDescription} style={styles.input} />
          <TextInput label="Plataforma" value={platform} onChangeText={setPlatform} style={styles.input} />
          <TextInput label="Data" value={date} onChangeText={setDate} style={styles.input} placeholder="DD/MM/AAAA" />
          <TextInput label="Nota (0-10)" value={rating} onChangeText={setRating} keyboardType="numeric" style={styles.input} />

          <Button mode="contained" onPress={saveNote}>
            Salvar
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  input: { marginBottom: 10 },
  card: { padding: 10 },
});
