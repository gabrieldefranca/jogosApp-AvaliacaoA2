import React, { useEffect, useState } from 'react';
import { ScrollView, Image } from 'react-native';
import { Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import { fetchGameDetails } from '../api/rawg';

export default function Details({ route }) {
  const { id } = route.params;
  const [game, setGame] = useState(null);

  useEffect(() => {
    fetchGameDetails(id).then(setGame);
  }, []);

  if (!game) return <ActivityIndicator style={{ marginTop: 50 }} />;

  return (
    <ScrollView style={{ padding: 8 }}>
      <Title>{game.name}</Title>
      <Image
        source={{ uri: game.background_image }}
        style={{ width: '100%', height: 200, borderRadius: 8 }}
      />
      <Paragraph style={{ marginTop: 10 }}>{game.description_raw}</Paragraph>
    </ScrollView>
  );
}
