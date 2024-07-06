import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, FlatList, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Appbar, Button, Card, TextInput, Title } from 'react-native-paper';

const { width } = Dimensions.get('window');
const API_KEY = '99f9b8b69f7ce637718c7239'; 

const HomeScreen = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [exchangeRates, setExchangeRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`);
        setExchangeRates(response.data.conversion_rates);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
        Alert.alert('Error', 'Unable to fetch exchange rates. Please try again later.');
      }
    };
    fetchExchangeRates();
    loadFavorites();
  }, []);

  const convertCurrency = () => {
    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
      Alert.alert('Error', 'Invalid currency selected.');
      return;
    }
    const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
    const result = parseFloat(amount) * rate;
    navigation.navigate('Result', { result: result.toFixed(2), toCurrency });
  };

  const saveToFavorites = async () => {
    if (!amount || !fromCurrency || !toCurrency) {
      Alert.alert('Error', 'Please enter all details.');
      return;
    }
    const favorite = { amount, fromCurrency, toCurrency };
    
    // Check for duplicates
    const duplicate = favorites.find(fav => 
      fav.amount === amount && fav.fromCurrency === fromCurrency && fav.toCurrency === toCurrency
    );

    if (duplicate) {
      Alert.alert('Error', 'This favorite already exists.');
      return;
    }

    const updatedFavorites = [...favorites, favorite];
    setFavorites(updatedFavorites);
    await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const loadFavorites = async () => {
    const favoritesData = await AsyncStorage.getItem('favorites');
    if (favoritesData) {
      setFavorites(JSON.parse(favoritesData));
    }
  };

  const renderFavorite = ({ item }) => (
    <TouchableOpacity onPress={() => {
      setAmount(item.amount);
      setFromCurrency(item.fromCurrency);
      setToCurrency(item.toCurrency);
    }}>
      <Card style={styles.favoriteCard}>
        <Card.Content>
          <Title>{item.amount} {item.fromCurrency} to {item.toCurrency}</Title>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Manny's Money Machine" />
      </Appbar.Header>
      <View style={styles.box}>
        <TextInput
          mode="outlined"
          label="Enter amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
        />
        <Picker
          selectedValue={fromCurrency}
          style={styles.picker}
          onValueChange={(itemValue) => setFromCurrency(itemValue)}>
          <Picker.Item label="Select currency" value="" />
          {Object.keys(exchangeRates).map((currency) => (
            <Picker.Item key={currency} label={currency} value={currency} />
          ))}
        </Picker>
        <Picker
          selectedValue={toCurrency}
          style={styles.picker}
          onValueChange={(itemValue) => setToCurrency(itemValue)}>
          <Picker.Item label="Select currency" value="" />
          {Object.keys(exchangeRates).map((currency) => (
            <Picker.Item key={currency} label={currency} value={currency} />
          ))}
        </Picker>
        <Button mode="contained" onPress={convertCurrency} style={styles.button}>
          Convert
        </Button>
        <Button mode="contained" onPress={saveToFavorites} style={styles.button}>
          Save to Favorites
        </Button>
      </View>
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
  box: {
    padding: 20,
    marginBottom: 20,
    width: width * 0.9,
    alignSelf: 'center',
  },
  input: {
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
  button: {
    marginVertical: 10,
  },
  favoritesList: {
    marginTop: 20,
  },
  favoriteCard: {
    marginBottom: 10,
  },
});

export default HomeScreen;
