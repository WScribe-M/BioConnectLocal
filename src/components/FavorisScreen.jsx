import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ScrollView, StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SQLite from 'react-native-sqlite-storage';
import {useFocusEffect} from "@react-navigation/native";

const db = SQLite.openDatabase({ name: 'Favoris2.db', location: 'default' });

export default function FavorisScreen({ navigation }) {
    const [producers, setProducers] = useState([]);
    const [articles, setArticles] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            loadProducers();
            loadArticles();
        }, [])
    );


    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql(`
            CREATE TABLE IF NOT EXISTS producers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                operator_id TEXT,
                name TEXT,
                address TEXT,
                siret TEXT,
                activites TEXT,
                produits TEXT,
                numeroBio TEXT,
                telephone TEXT,
                siteWeb TEXT,
                favori INTEGER
            );
        `);

            tx.executeSql(`
            CREATE TABLE IF NOT EXISTS articles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                description TEXT,
                type TEXT
            );
        `);
        }, err => console.error('❌ Création de table échouée', err), () => {
            console.log('✅ Tables créées, vérification des données...');
            insertTestDataIfNeeded();
        });
    }, []);

    const insertTestDataIfNeeded = () => {
        db.transaction(tx => {
            // PRODUCTEURS
            tx.executeSql('SELECT COUNT(*) as count FROM producers', [], (_, { rows }) => {
                const count = rows.item(0).count;
                console.log('Nb producteurs dans la DB:', count);
                if (count === 0) {
                    console.log('➡️ Insertion producteurs test...');
                    tx.executeSql(
                        `INSERT INTO producers (operator_id, name, address, siret, activites, produits, numeroBio, telephone, siteWeb, favori) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                         [
                            'P001', 'Bio Fermier', '15 Rue des Producteurs, Amiens', '12345678912345',
                            JSON.stringify(['Production', 'Vente directe']),
                            JSON.stringify(['Tomates', 'Salades']),
                            'FR-BIO-01', '0612345678', 'https://biofermier.fr', 1
                        ],
                        () => console.log('✅ Producteur 1 inséré'),
                        (_, err) => { console.error('❌ Erreur INSERT producteur 1', err); return false; }
                    );
                    // Deuxième producteur
                    tx.executeSql(
                        `INSERT INTO producers (operator_id, name, address, siret, activites, produits, numeroBio, telephone, siteWeb, favori) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            'P002', 'Marché Bio', '27 Rue de la Santé, Lille', '98765432198765',
                            JSON.stringify(['Préparation', 'Magasin spécialisé']),
                            JSON.stringify(['Pain', 'Miel']),
                            'FR-BIO-02', '0698765432', 'https://marchebio.fr', 1
                        ],
                        () => {
                            console.log('✅ Producteur 2 inséré');
                            setTimeout(() => loadProducers(), 300); // On recharge la liste après les 2 inserts
                        },
                        (_, err) => { console.error('❌ Erreur INSERT producteur 2', err); return false; }
                    );
                    // Troisième producteur
                    tx.executeSql(
                        `INSERT INTO producers (operator_id, name, address, siret, activites, produits, numeroBio, telephone, siteWeb, favori) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            'P003', 'Ferme Bio', '43 Route Amiens, Abbeville', '98765432198765',
                            JSON.stringify(['Préparation', 'Ferme spécialisé']),
                            JSON.stringify(['Blé', 'Miel']),
                            'FR-BIO-03', '0698765432', 'https://Fermebio.fr', 0
                        ],
                        () => {
                            console.log('✅ Producteur 2 inséré');
                            setTimeout(() => loadProducers(), 300); // On recharge la liste après les 2 inserts
                        },
                        (_, err) => { console.error('❌ Erreur INSERT producteur 2', err); return false; }
                    );
                } else {
                    console.log('ℹ️ Producteurs déjà présents');
                    loadProducers();
                }
            });

            // ARTICLES
            tx.executeSql('SELECT COUNT(*) as count FROM articles', [], (_, { rows }) => {
                if (rows.item(0).count === 0) {
                    tx.executeSql(
                        `INSERT INTO articles (name, description, type) VALUES (?, ?, ?)`,
                        ['Tomates', 'Tomates cerises bio', 'vegetable'],
                        () => console.log('✅ Article 1 inséré')
                    );
                    tx.executeSql(
                        `INSERT INTO articles (name, description, type) VALUES (?, ?, ?)`,
                        ['Miel', 'Miel toutes fleurs', 'honey'],
                        () => console.log('✅ Article 2 inséré')
                    );
                    tx.executeSql(
                        `INSERT INTO articles (name, description, type) VALUES (?, ?, ?)`,
                        ['Pain', 'Pain bio au levain', 'bread'],
                        () => {
                            console.log('✅ Article 3 inséré');
                            setTimeout(() => loadArticles(), 300);
                        }
                    );
                } else {
                    loadArticles();
                }
            });
        });
    };

    const loadProducers = () => {
        console.log("Chargement des producteurs...");
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM producers', [], (_, { rows }) => {
                const items = [];
                for (let i = 0; i < rows.length; i++) {
                    const item = rows.item(i);
                    items.push({ ...item, activites: JSON.parse(item.activites), produits: JSON.parse(item.produits) });
                }
                console.log("Producteurs récupérés :", items);
                setProducers(items);
            });
        });
    };

    const loadArticles = () => {
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM articles', [], (_, { rows }) => {
                const items = [];
                for (let i = 0; i < rows.length; i++) {
                    items.push(rows.item(i));
                }
                setArticles(items);
            });
        });
    };

    const deleteItem = (table, id, reloadFunc) => {
        db.transaction(tx => { tx.executeSql(`DELETE FROM ${table} WHERE id=?`, [id], reloadFunc); });
    };

    const confirmDelete = (table, id, name, reloadFunc) => {
        Alert.alert('Confirmer', `Supprimer "${name}" ?`, [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Supprimer', style: 'destructive', onPress: () => deleteItem(table, id, reloadFunc) },
        ]);
    };

    const iconMap = { vegetable: 'nutrition', honey: 'flower', bread: 'fast-food', default: 'cube' };

    return (
        <ScrollView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#4caf50" />
            <View style={styles.header}>
                <Ionicons name="star" size={30} color="#fff" />
                <Text style={styles.headerTitle}>Mes Favoris Bio</Text>
            </View>

            <Text style={styles.sectionTitle}>🍃 Producteurs Favoris</Text>
            <FlatList
                scrollEnabled={false}
                data={producers}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate('OperatorDetails', { operateur: item })}
                        onLongPress={() => confirmDelete('producers', item.id, item.name, loadProducers)}
                    >
                        <Ionicons name="leaf" size={28} color="#4caf50" style={styles.icon} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            <Text style={styles.cardSub}>{item.address}</Text>
                            <Text style={styles.cardId}>ID : {item.operator_id}</Text>
                        </View>
                        {/*<Ionicons name="trash" size={24} color="#ff7043" onPress={() => confirmDelete('producers', item.id, item.name, loadProducers)} />*/}
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.empty}>Aucun producteur</Text>}
            />

            <Text style={styles.sectionTitle}>🛒 Articles Favoris</Text>
            <FlatList
                scrollEnabled={false}
                data={articles}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onLongPress={() => confirmDelete('articles', item.id, item.name, loadArticles)}>
                        <Ionicons name={iconMap[item.type] || iconMap.default} size={28} color="#ff7043" style={styles.icon} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            <Text style={styles.cardSub}>{item.description}</Text>
                        </View>
                        <Ionicons name="trash" size={24} color="#ff7043" onPress={() => confirmDelete('articles', item.id, item.name, loadArticles)} />
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.empty}>Aucun article</Text>}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f4f8'
    },
    header: {
        paddingTop: 40,
        height: 115,
        backgroundColor: '#4caf50',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 10
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20, marginLeft: 15,
        color: '#37474f'
    },
    card: {
        flexDirection: 'row',
        padding: 16,
        margin: 10,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4
    },
    icon: {
        marginRight: 16
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#263238'
    },
    cardSub: {
        fontSize: 14,
        color: '#607d8b',
        marginTop: 4
    },
    cardId: {
        fontSize: 12,
        color: '#90a4ae',
        marginTop: 4
    },
    empty: {
        textAlign: 'center',
        margin: 20,
        color: '#aaa'
    },
});
