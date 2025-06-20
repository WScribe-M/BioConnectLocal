import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Map from './Map';
import { useNavigation } from '@react-navigation/native';



const Search = () => {
  const [addresses, setAddresses] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredAddresses, setFilteredAddresses] = useState([]);
  const [sortByExperience, setSortByExperience] = useState(false);
  const navigation = useNavigation();

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
            lieu: addr.lieu || '',
            siret: item.siret || '',
            numeroBio: item.numeroBio || '',
            lat: addr.lat,
            long: addr.long,
            nom: item.denominationcourante || item.raisonSociale || 'Sans nom',
            dateEngagement: item.certificats?.[0]?.dateEngagement || null,
            productions: (item.productions || []).map(prod => prod.nom),
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
    let results = [];

    if (search.trim() !== '') {
      results = addresses.filter(addr =>
        addr.ville.toLowerCase().startsWith(search.toLowerCase()) ||
        addr.codePostal.startsWith(search)
      );
    }

    if (sortByExperience) {
      results.sort((a, b) => {
        const dateA = new Date(a.dateEngagement || '1900-01-01');
        const dateB = new Date(b.dateEngagement || '1900-01-01');
        return dateB - dateA;
      });
    }

    setFilteredAddresses(results);
  }, [search, addresses, sortByExperience]);

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

        {search.trim() !== '' && (
          <TouchableOpacity
            onPress={() => setSortByExperience(!sortByExperience)}
            style={styles.sortButton}
          >
            <Text style={styles.sortButtonText}>
              {sortByExperience ? '🔽 Annuler tri' : '⭐ Trier par expérience Bio'}
            </Text>
          </TouchableOpacity>
        )}

        {search.trim() !== '' && (
          <ScrollView style={styles.cardList}>
            {filteredAddresses.length > 0 ? (
              filteredAddresses.map(addr => (
                <View key={addr.id} style={styles.card}>
                  <Text style={styles.cardTitle}>{addr.nom}</Text>
                  <Text style={styles.cardLocation}>
                    📍 {addr.ville} ({addr.codePostal})
                  </Text>
                  {addr.dateEngagement && (
                    <Text style={styles.cardDate}>
                      🕒 Engagé bio depuis : {new Date(addr.dateEngagement).toLocaleDateString()}
                    </Text>
                  )}
                  <TouchableOpacity
                    style={styles.cardButton}
                    onPress={() => navigation.navigate('OperatorDetails', { operateur: addr })}
                  >
                    <Text style={styles.cardButtonText} >Voir plus</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.noResults}>Aucun résultat trouvé</Text>
            )}
          </ScrollView>
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
  sortButton: {
    backgroundColor: '#e0f0ff',
    alignSelf: 'flex-start',
    marginHorizontal: 12,
    marginBottom: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  sortButtonText: {
    color: '#007acc',
    fontWeight: 'bold',
  },
  cardList: {
    marginHorizontal: 12,
    maxHeight: 300,
  },
  card: {
    backgroundColor: '#fdfdfd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    color: '#333',
  },
  cardLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 13,
    color: '#999',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  cardButton: {
    backgroundColor: '#007acc',
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
  },
  cardButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  noResults: {
    textAlign: 'center',
    color: '#aaa',
    paddingVertical: 12,
    fontStyle: 'italic',
  },
  mapContainer: {
    flex: 1,
    marginTop: 10,
  },
});

export default Search;
