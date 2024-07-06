import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import AboutScreen from './components/AboutScreen';
import FavoritesScreen from './components/FavoritesScreen';
import HistoricalDataScreen from './components/HistoricalDataScreen';
import HomeScreen from './components/HomeScreen';
import ResultScreen from './components/ResultScreen';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Result" component={ResultScreen} />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Favorites') {
              iconName = 'favorite';
            } else if (route.name === 'About') {
              iconName = 'info';
            } else if (route.name === 'HistoricalData') {
              iconName = 'history';
            }

            return <MaterialIcons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Favorites" component={FavoritesScreen} />
        <Tab.Screen name="About" component={AboutScreen} />
        <Tab.Screen name="HistoricalData" component={HistoricalDataScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
