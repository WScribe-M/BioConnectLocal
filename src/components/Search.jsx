import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput,  SafeAreaView} from 'react-native';
import Map from './Map';
import { useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Search = () => {
    const [text, onChangeText] = useState('');

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View>
                    <TextInput
                        style={styles.input}
                        onChangeText={onChangeText}
                        value={text}
                        placeholder="Rechercher.."
                    />
                </View>

               <View style={styles.mapContainer}>
                   <Text>test</Text>
                   <Map />
               </View>

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
});



export default Search;