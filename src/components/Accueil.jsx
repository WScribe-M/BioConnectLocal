import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const Accueil = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello World !</Text>
      <Button
        title="Aller à la page API"
        onPress={() => navigation.navigate('ApiPage')}
      />
      <Button
        title="Afficher les données"
        onPress={() => navigation.navigate('AffichageDonnees')}
      />
      <Button
          title="Rechercher"
          onPress={() => navigation.navigate('Search')}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default Accueil;