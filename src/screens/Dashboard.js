import React, { useState, useCallback } from 'react';
import { View, Dimensions, StyleSheet, ScrollView, Alert } from 'react-native';
import { Title, Text, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { useFocusEffect } from '@react-navigation/native';

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [barData, setBarData] = useState([]);

  const loadData = async () => {
    const favs = await AsyncStorage.getItem('favorites');
    const favsParsed = favs ? JSON.parse(favs) : [];

    // Agrupar por plataforma
    const countByPlatform = {};
    favsParsed.forEach((g) => {
      const platforms = g.parent_platforms?.map(p => p.platform.name) || ['Desconhecido'];
      platforms.forEach(platform => {
        countByPlatform[platform] = (countByPlatform[platform] || 0) + 1;
      });
    });

    const chartData = Object.entries(countByPlatform).map(([key, value], i) => ({
      name: key,
      population: value,
      color: chartColors[i % chartColors.length],
      legendFontColor: '#333',
      legendFontSize: 15,
    }));

    const barLabels = Object.keys(countByPlatform);
    const barValues = Object.values(countByPlatform);

    setData(chartData);
    setBarData({
      labels: barLabels,
      datasets: [{ data: barValues }],
    });
  };

  const clearData = () => {
    Alert.alert(
      'Limpar Dashboard e Favoritos',
      'Tem certeza de que deseja limpar os gráficos e os jogos favoritos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('favorites'); // 🔥 Limpa favoritos
              setData([]);
              setBarData([]);
              Alert.alert('Sucesso', 'Dashboard e favoritos foram apagados.');
            } catch (error) {
              console.error('Erro ao limpar dados', error);
              Alert.alert('Erro', 'Não foi possível limpar os dados.');
            }
          }
        }
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  if (data.length === 0) {
    return (
      <View style={styles.empty}>
        <Text>Adicione jogos favoritos para visualizar o Dashboard.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Dashboard - Jogos Favoritos</Title>

      <Button
        mode="contained"
        onPress={clearData}
        style={styles.button}
        buttonColor="#d32f2f"
      >
        Limpar Dashboard e Favoritos
      </Button>

      <Text style={styles.subTitle}>Distribuição por Plataforma</Text>
      <PieChart
        data={data}
        width={Dimensions.get('window').width - 16}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />

      <Text style={styles.subTitle}>Quantidade por Plataforma</Text>
      <BarChart
        data={barData}
        width={Dimensions.get('window').width - 16}
        height={280}
        chartConfig={chartConfig}
        fromZero
        showValuesOnTopOfBars
        yAxisSuffix=" jogos"
        verticalLabelRotation={30}
      />
    </ScrollView>
  );
}

const chartColors = [
  '#F44336',
  '#2196F3',
  '#FFEB3B',
  '#4CAF50',
  '#9C27B0',
  '#FF9800',
  '#795548',
  '#00BCD4',
  '#8BC34A',
  '#E91E63',
];

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#ffa726',
  },
  propsForBackgroundLines: {
    stroke: '#ccc',
  },
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    alignSelf: 'center',
    marginVertical: 8,
  },
  subTitle: {
    marginTop: 12,
    marginBottom: 4,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    marginVertical: 10,
  },
});