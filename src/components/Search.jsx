import { View, Text, StyleSheet, ActivityIndicator, TextInput,  SafeAreaView, Button} from 'react-native';
import Map from './Map';
import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Search = () => {
    const [addresses, setAddresses] = useState([]);
    const [search, setSearch] = useState('');

     useEffect(() => {
       const fetchData = async () => {
         try {
           const res = await fetch('https://opendata.agencebio.org/api/gouv/operateurs/');
           const json = await res.json();

           // Extraction des adresses depuis chaque item
           const data = json.items?.flatMap(item =>
             (item.adressesOperateurs || []).map(addr => ({
               id: addr.id,
               ville: addr.ville,
               codePostal: addr.codePostal,
               lat: addr.lat,
               long: addr.long,
             }))
           ) || [];

           console.log('Données transformées pour la carte :', data);
           setAddresses(data);

         } catch (error) {
           console.error('Erreur lors de la récupération des données :', error);
         }
       };

       fetchData();
     }, []);
//console.log('Adresse unique pour test :', addresses);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View>
                    <TextInput
                        style={styles.input}
                        onChangeText={setSearch}
                        value={search}
                        placeholder="Entrer un code Postal ou une ville"
                    />
                </View>

               {addresses.length > 0 ? (
                 <View style={styles.mapContainer}>
                   <Map markers={addresses} />
                 </View>
               ) : (
                 <View style={styles.loaderContainer}>
                   <ActivityIndicator size="large" color="#0000ff" />
                   <Text>Chargement de la carte...</Text>
                 </View>
               )}


            </SafeAreaView>
        </SafeAreaProvider>


    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mapContainer: {
        flex: 1,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

});



export default Search;