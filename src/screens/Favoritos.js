import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Button, Text, IconButton, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function Favorites({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const { colors } = useTheme();

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [])
  );

  async function loadFavorites() {
    const favs = await AsyncStorage.getItem('favoritos');
    setFavorites(favs ? JSON.parse(favs) : []);
  }

  async function removeFavorite(id) {
    const updated = favorites.filter(item => item.id !== id);
    await AsyncStorage.setItem('favorites', JSON.stringify(updated));
    setFavorites(updated);
  }

  async function clearFavorites() {
    await AsyncStorage.removeItem('favorites');
    setFavorites([]);
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.onBackground }]}>
          Nenhum jogo favorito encontrado.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        numColumns={2}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Cover source={{ uri: item.background_image }} style={styles.image} />
            <Card.Title title={item.name} titleNumberOfLines={2} />
            <Card.Actions style={styles.actions}>
              <Button compact onPress={() => navigation.navigate('Details', { id: item.id })}>
                Detalhes
              </Button>
              <IconButton icon="delete" onPress={() => removeFavorite(item.id)} />
            </Card.Actions>
          </Card>
        )}
      />

      <IconButton
        icon="delete-sweep"
        style={styles.fab}
        onPress={clearFavorites}
        size={28}
        iconColor="#fff"
        containerColor={colors.error}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 8,
  },
  card: {
    flex: 1,
    margin: 6,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    height: 120,
  },
  actions: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    borderRadius: 28,
    elevation: 4,
  },
});
