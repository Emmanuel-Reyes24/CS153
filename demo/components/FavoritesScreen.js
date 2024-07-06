import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet } from 'react-native';
import { Appbar, Button, Card, Title } from 'react-native-paper';

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      const favoritesData = await AsyncStorage.getItem('favorites');
      if (favoritesData) {
        setFavorites(JSON.parse(favoritesData));
      }
    };
    loadFavorites();
  }, []);

  const renderFavorite = ({ item }) => (
    <Card style={styles.favoriteCard}>
      <Card.Content>
        <Title>{item.amount} {item.fromCurrency} to {item.toCurrency}</Title>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => handleRemoveFavorite(item)}>Remove</Button>
      </Card.Actions>
    </Card>
  );

  const handleRemoveFavorite = async (itemToRemove) => {
    const updatedFavorites = favorites.filter(
      item => item.fromCurrency !== itemToRemove.fromCurrency || item.toCurrency !== itemToRemove.toCurrency || item.amount !== itemToRemove.amount
    );
    setFavorites(updatedFavorites);
    await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Favorites" />
      </Appbar.Header>
      <FlatList
        data={favorites}
        renderItem={renderFavorite}
        keyExtractor={(item, index) => index.toString()}
        style={styles.favoritesList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  favoritesList: {
    padding: 20,
  },
  favoriteCard: {
    marginBottom: 10,
  },
});

export default FavoritesScreen;
