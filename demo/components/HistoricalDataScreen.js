import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Appbar, Text } from 'react-native-paper';

const { width } = Dimensions.get('window');
const API_KEY = '99f9b8b69f7ce637718c7239'; // Replace with your actual API key

const HistoricalDataScreen = ({ navigation }) => {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [historicalData, setHistoricalData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistoricalData();
  }, [fromCurrency, toCurrency]);

  const fetchHistoricalData = async () => {
    const currentYear = new Date().getFullYear();
    const startDate = `${currentYear - 10}-01-01`;
    const endDate = `${currentYear}-01-01`;

    try {
      const response = await axios.get(
        `https://api.currencyapi.com/v3/historical?apikey=${API_KEY}&base_currency=${fromCurrency}&currencies=${toCurrency}&date_from=${startDate}&date_to=${endDate}`
      );
      const data = response.data.data;
      const dates = Object.keys(data).sort();
      const rates = dates.map((date) => data[date][toCurrency]);

      setLabels(dates);
      setHistoricalData(rates);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching historical data:', error);
      Alert.alert('Error', 'Unable to fetch historical data. Please check your API key and try again later.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Historical Data" />
      </Appbar.Header>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={fromCurrency}
          style={styles.picker}
          onValueChange={(itemValue) => setFromCurrency(itemValue)}
        >
          <Picker.Item label="USD" value="USD" />
          <Picker.Item label="EUR" value="EUR" />
          <Picker.Item label="GBP" value="GBP" />
          {/* Add other currencies as needed */}
        </Picker>
        <Picker
          selectedValue={toCurrency}
          style={styles.picker}
          onValueChange={(itemValue) => setToCurrency(itemValue)}
        >
          <Picker.Item label="USD" value="USD" />
          <Picker.Item label="EUR" value="EUR" />
          <Picker.Item label="GBP" value="GBP" />
          {/* Add other currencies as needed */}
        </Picker>
      </View>
      <ScrollView>
        <View style={styles.chartContainer}>
          {loading ? (
            <Text>Loading...</Text>
          ) : (
            <LineChart
              data={{
                labels: labels,
                datasets: [
                  {
                    data: historicalData,
                  },
                ],
              }}
              width={width * 0.9}
              height={220}
              yAxisLabel="$"
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              style={styles.chart}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  picker: {
    height: 50,
    width: 150,
  },
  chartContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default HistoricalDataScreen;

