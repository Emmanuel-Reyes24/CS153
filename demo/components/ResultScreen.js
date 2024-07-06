import React from 'react';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const ResultScreen = ({ route, navigation }) => {
  const { result, toCurrency } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Conversion Result</Text>
        <Text style={styles.result}>{result} {toCurrency}</Text>
        <Button title="Back" onPress={() => navigation.goBack()} color="#0000FF" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  box: {
    borderWidth: 3,
    borderColor: '#0000FF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  result: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ResultScreen;

