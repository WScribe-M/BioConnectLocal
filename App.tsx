import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SplashScreen from './src/components/SplashScreen';
import Accueil from './src/components/Accueil';
import FavorisScreen from './src/components/FavorisScreen';
import Search from './src/components/Search';
import OperatorDetails from './src/components/OperatorDetails';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { initDatabase, closeDatabase } from './src/services/migrations/index.js';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
      <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false, // Les tabs n'ont pas de header, le stack s'en charge
            tabBarActiveTintColor: '#fff',
            tabBarInactiveTintColor: '#e0e0e0',
            tabBarStyle: {
              backgroundColor: '#4caf50',
              height: 90,
              paddingTop: 10,
            },
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Accueil') iconName = focused ? 'home' : 'home-outline';
              else if (route.name === 'FavorisScreen') iconName = focused ? 'star' : 'star-outline';
              else if (route.name === 'Search') iconName = focused ? 'search' : 'search-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
      >
        <Tab.Screen name="Accueil" component={Accueil} options={{ title: 'Accueil' }} />
        <Tab.Screen name="Search" component={Search} options={{ title: 'Recherche' }} />
        <Tab.Screen name="FavorisScreen" component={FavorisScreen} options={{ title: 'Favoris' }} />
      </Tab.Navigator>
  );
}

function App() {
  useEffect(() => {
    initDatabase()
        .then(() => console.log('Database initialized successfully.'))
        .catch(error => console.error('Failed to initialize database:', error));

    return () => { closeDatabase(); };
  }, []);

  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
          {/* Met la TabBar après Splash */}
          <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
          <Stack.Screen
              name="OperatorDetails"
              component={OperatorDetails}
              options={{
                title: 'Détails du producteur',
                headerBackTitle: 'Retour',
                headerStyle: { backgroundColor: '#4caf50' },
                headerTintColor: '#fff'
              }}
          />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

export default App;