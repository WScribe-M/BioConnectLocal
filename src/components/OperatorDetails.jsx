import React from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking, Alert, StatusBar} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SQLite from "react-native-sqlite-storage";

export default function OperatorDetails({ route, navigation }) {
    const operateur = route.params.operateur;

    console.log(operateur.favori);

    const db = SQLite.openDatabase({ name: 'Favoris.db', location: 'default' });
    const removeFromFavorites = () => {
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM producers WHERE id = ?',
                [operateur.id],
                (_, result) => {
                    Alert.alert('Retiré des favoris', `"${operateur.name}" a bien été retiré.`);
                    navigation.goBack();
                },
                (_, error) => {
                    Alert.alert('Erreur', 'Impossible de retirer ce favori : ' + error.message);
                    return false;
                }
            );
        });
    };

    const ajouterAuxFavoris = () => {
        Alert.alert('Coucou', `Test`, [
            { text: 'Annuler', style: 'cancel' },
        ]);
    }

    const confirmDelete = () => {
        Alert.alert('Confirmer', `Supprimer "${operateur.name}" ?`, [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Supprimer', style: 'destructive', onPress: () => removeFromFavorites() },
        ]);
    };

    const callOperator = () => {
        Linking.openURL(`tel:${operateur.telephone}`).catch(err => Alert.alert('Erreur', 'Impossible de passer l’appel'));
    };

    const visitWebsite = () => {
        Linking.openURL(operateur.siteWeb).catch(err => Alert.alert('Erreur', 'Impossible d’ouvrir le site'));
    };

    return (
        <ScrollView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#4caf50" />
            <View style={styles.bandeau}>
                <Ionicons name="leaf" size={30} color="#fff" />
                <Text style={styles.bandeauTitle}>{operateur.name}</Text>
            </View>
            <View style={{ padding: 20 }}>
                {/*<Text style={styles.header}>{operateur.name}</Text>*/}

                <View style={styles.card}>
                    <Text style={styles.label}>📍 Adresse</Text>
                    <Text style={styles.content}>{operateur.address}</Text>

                    <Text style={styles.label}>SIRET</Text>
                    <Text style={styles.content}>{operateur.siret}</Text>

                    <Text style={styles.label}>🍃 Activités</Text>
                    {operateur.activites.map((act, index) => (
                        <Text key={index} style={styles.content}>- {act}</Text>
                    ))}

                    <Text style={styles.label}>🛒 Produits</Text>
                    {operateur.produits.map((prod, index) => (
                        <Text key={index} style={styles.content}>- {prod}</Text>
                    ))}

                    <Text style={styles.label}>🌿 Numéro Bio</Text>
                    <Text style={styles.content}>{operateur.numeroBio}</Text>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity style={styles.btn} onPress={callOperator}>
                        <Ionicons name="call" size={24} color="#fff" />
                        <Text style={styles.btnText}>Appeler</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btn} onPress={visitWebsite}>
                        <Ionicons name="globe" size={24} color="#fff" />
                        <Text style={styles.btnText}>Site web</Text>
                    </TouchableOpacity>
                </View>

                {operateur.favori === 1 ? (
                    <TouchableOpacity style={styles.favoriteBtn} onPress={confirmDelete}>
                        <Ionicons name="star" size={24} color="#fff" />
                        <Text style={styles.favoriteBtnText}>Retirer des Favoris</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.favoriteBtn} onPress={ajouterAuxFavoris}>
                        <Ionicons name="star-outline" size={24} color="#fff" />
                        <Text style={styles.favoriteBtnText}>Ajouter aux Favoris</Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fbfc',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4caf50',
        marginBottom: 20,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
        marginBottom: 20,
    },
    label: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 15,
    },
    content: {
        fontSize: 16,
        color: '#555',
        marginLeft: 10,
        marginTop: 5,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        backgroundColor: '#4caf50',
        padding: 12,
        borderRadius: 10,
        marginHorizontal: 5,
    },
    btnText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 8,
    },
    favoriteBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ff9800',
        padding: 14,
        borderRadius: 12,
        marginTop: 10,
    },
    favoriteBtnText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    bandeau: {
        paddingTop: 40,
        paddingBottom: 20,
        backgroundColor: '#4caf50',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bandeauTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 10
    }
});