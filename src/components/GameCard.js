import React from 'react';
import { Card, Button, Text } from 'react-native-paper';

export default function GameCard({ game, onPress, onFavorite }) {
  return (
    <Card style={{ margin: 8 }}>
      <Card.Cover source={{ uri: game.background_image }} />
      <Card.Title title={game.name} />
      <Card.Content>
        <Text>Nota: {game.rating}</Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={onPress}>Detalhes</Button>
        <Button onPress={onFavorite}>Favoritar</Button>
      </Card.Actions>
    </Card>
  );
}