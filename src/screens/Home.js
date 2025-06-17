import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  FlatList,
  View,
  TextInput,
  StyleSheet,
  Alert,
  Keyboard,
  Animated,
} from 'react-native';
import {
  Card,
  Button,
  ActivityIndicator,
  Text,
  IconButton,
} from 'react-native-paper';
import { fetchGames } from '../api/rawg';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home({ navigation }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);
  const [addingFavId, setAddingFavId] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const listRef = useRef(null);

  const loadGames = useCallback(
    async (searchTerm = '') => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchGames(searchTerm);
        setGames(data);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
        listRef.current?.scrollToOffset({ offset: 0, animated: true });
      } catch {
        setError('Erro ao buscar jogos');
        setGames([]);
      } finally {
        setLoading(false);
      }
    },
    [fadeAnim]
  );

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  useEffect(() => {
    const timer = setTimeout(() => loadGames(query), 500);
    return () => clearTimeout(timer);
  }, [query, loadGames]);

  const addToFavorites = async (game) => {
    Alert.alert('Adicionar aos Favoritos', `Adicionar "${game.name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sim',
        onPress: async () => {
          setAddingFavId(game.id);
          try {
            const favs = await AsyncStorage.getItem('favorites');
            const favsParsed = favs ? JSON.parse(favs) : [];
            if (favsParsed.some((item) => item.id === game.id)) {
              Alert.alert('Aviso', 'Jogo já está nos favoritos!');
              return;
            }
            await AsyncStorage.setItem(
              'favorites',
              JSON.stringify([...favsParsed, game])
            );
            Alert.alert('Sucesso', 'Jogo adicionado aos favoritos!');
          } catch {
            Alert.alert('Erro', 'Não foi possível adicionar aos favoritos.');
          } finally {
            setAddingFavId(null);
          }
        },
      },
    ]);
  };

  // Função para formatar data para dd/mm/yyyy
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Data não disponível';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar jogos..."
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          onSubmitEditing={() => {
            Keyboard.dismiss();
            loadGames(query);
          }}
        />
        {query.length > 0 && (
          <IconButton
            icon="close"
            size={20}
            onPress={() => {
              setQuery('');
              Keyboard.dismiss();
            }}
            style={styles.clearButton}
          />
        )}
      </View>

      {loading && <ActivityIndicator style={styles.loading} size="large" />}

      {error && <Text style={styles.error}>{error}</Text>}

      {!loading && !error && games.length === 0 && (
        <Text style={styles.noResults}>Nenhum jogo encontrado.</Text>
      )}

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <FlatList
          ref={listRef}
          data={games}
          keyExtractor={(item) => String(item.id)}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Card style={styles.card} elevation={3}>
              <Card.Cover source={{ uri: item.background_image }} />
              <Card.Title
                title={item.name}
                subtitle={`Avaliação: ${item.rating ?? 'N/A'} | Lançamento: ${formatDate(
                  item.released
                )}`}
              />
              <Card.Actions>
                <Button
                  mode="outlined"
                  onPress={() => navigation.navigate('Details', { id: item.id })}
                >
                  Detalhes
                </Button>
                <Button
                  mode="contained"
                  onPress={() => addToFavorites(item)}
                  loading={addingFavId === item.id}
                  disabled={addingFavId === item.id}
                >
                  {addingFavId === item.id ? 'Favoritando...' : 'Favoritar'}
                </Button>
              </Card.Actions>
            </Card>
          )}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: { margin: 12, position: 'relative' },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#6200ee',
    borderRadius: 8,
    paddingHorizontal: 40,
    fontSize: 16,
  },
  clearButton: {
    position: 'absolute',
    right: 0,
    top: 8,
    color: '#6200ee',
  },
  card: { marginHorizontal: 12, marginVertical: 6 },
  loading: { marginTop: 20 },
  error: { color: 'red', textAlign: 'center', marginTop: 20 },
  noResults: {
    marginTop: 50,
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
  },
});
