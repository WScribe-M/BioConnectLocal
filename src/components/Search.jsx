import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Map from './Map';

const Search = () => {
  const [addresses, setAddresses] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredAddresses, setFilteredAddresses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://opendata.agencebio.org/api/gouv/operateurs/');
        const json = await res.json();

        const data = json.items?.flatMap(item =>
          (item.adressesOperateurs || []).map(addr => ({
            id: addr.id,
            ville: addr.ville || '',
            codePostal: addr.codePostal || '',
            lat: addr.lat,
            long: addr.long,
          }))
        ) || [];

        setAddresses(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (search.trim() === '') {
      setFilteredAddresses([]);
    } else {
      const filtered = addresses.filter(addr =>
        addr.ville.toLowerCase().startsWith(search.toLowerCase()) ||
        addr.codePostal.startsWith(search)
      );
      setFilteredAddresses(filtered);
    }
  }, [search, addresses]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <TextInput
          style={styles.input}
          onChangeText={setSearch}
          value={search}
          placeholder="🔍 Entrez une ville ou un code postal"
          placeholderTextColor="#888"
        />

        {/* Affiche la liste uniquement si une recherche est en cours */}
        {search.trim() !== '' && (
          <View style={styles.listContainer}>
            <ScrollView style={styles.scrollList}>
              {filteredAddresses.length > 0 ? (
                filteredAddresses.map(addr => (
                  <TouchableOpacity
                    key={addr.id}
                    style={styles.operatorItem}
                    onPress={() => Alert.alert('Sélection', `${addr.ville} (${addr.codePostal})`)}
                  >
                    <Text style={styles.cityText}>{addr.ville}</Text>
                    <Text style={styles.postalText}>{addr.codePostal}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noResults}>Aucun résultat trouvé</Text>
              )}
            </ScrollView>
          </View>
        )}

        <View style={styles.mapContainer}>
          <Map markers={search.trim() !== '' ? filteredAddresses : addresses} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4caf50',
  },
  input: {
    height: 45,
    margin: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  listContainer: {
    marginHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
    maxHeight: 220,
  },
  scrollList: {
    paddingHorizontal: 4,
  },
  operatorItem: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cityText: {
    fontSize: 16,
    fontWeight: '600',
  },
  postalText: {
    fontSize: 14,
    color: '#666',
  },
  noResults: {
    textAlign: 'center',
    color: '#aaa',
    paddingVertical: 12,
    fontStyle: 'italic',
  },
  mapContainer: {
    flex: 1,
    marginTop: 8,
  },
});

export default Search;
