import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ScrollView, StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'Favoris.db', location: 'default' });

export default function FavorisScreen() {
    const [producers, setProducers] = useState([]);
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS producers (id INTEGER PRIMARY KEY AUTOINCREMENT, operator_id TEXT, name TEXT, address TEXT);');
            tx.executeSql('CREATE TABLE IF NOT EXISTS articles (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, type TEXT);');

            tx.executeSql('SELECT COUNT(*) as count FROM producers', [], (_, { rows }) => {
                if (rows.item(0).count === 0) {
                    tx.executeSql('INSERT INTO producers (operator_id, name, address) VALUES (?, ?, ?), (?, ?, ?)',
                        ['P001', 'Bio Fermier', '15 Rue des Producteurs, Amiens', 'P002', 'Marché Bio', '27 Rue de la Santé, Lille']);
                }
            });

            tx.executeSql('SELECT COUNT(*) as count FROM articles', [], (_, { rows }) => {
                if (rows.item(0).count === 0) {
                    tx.executeSql('INSERT INTO articles (name, description, type) VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?)',
                        ['Tomates', 'Tomates cerises bio', 'vegetable',
                            'Miel', 'Miel toutes fleurs', 'honey',
                            'Pain', 'Pain bio au levain', 'bread']);
                }
            });
        }, null, () => {
            loadProducers();
            loadArticles();
        });
    }, []);

    const loadProducers = () => {
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM producers', [], (_, { rows }) => {
                setProducers(rows.raw());
            });
        });
    };

    const loadArticles = () => {
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM articles', [], (_, { rows }) => {
                setArticles(rows.raw());
            });
        });
    };

    const deleteItem = (table, id, reloadFunc) => {
        db.transaction(tx => {
            tx.executeSql(`DELETE FROM ${table} WHERE id=?`, [id], reloadFunc);
        });
    };

    const confirmDelete = (table, id, name, reloadFunc) => {
        Alert.alert('Confirmer', `Supprimer "${name}" ?`, [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Supprimer', style: 'destructive', onPress: () => deleteItem(table, id, reloadFunc) },
        ]);
    };

    const iconMap = {
        vegetable: 'nutrition',
        honey: 'flower',
        bread: 'fast-food',
        default: 'cube',
    };

    return (
        <ScrollView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#00695c" />

            <View style={styles.header}>
                <Ionicons name="star" size={30} color="#fff" />
                <Text style={styles.headerTitle}>Mes Favoris Bio</Text>
            </View>

            <Text style={styles.sectionTitle}>🍃 Producteurs Favoris</Text>
            <FlatList
                data={producers}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onLongPress={() => confirmDelete('producers', item.id, item.name, loadProducers)}>
                        <Ionicons name="leaf" size={28} color="#00695c" style={styles.icon} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            <Text style={styles.cardSub}>{item.address}</Text>
                            <Text style={styles.cardId}>ID : {item.operator_id}</Text>
                        </View>
                        <Ionicons name="trash" size={24} color="#ff7043" onPress={() => confirmDelete('producers', item.id, item.name, loadProducers)} />
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.empty}>Aucun producteur</Text>}
            />

            <Text style={styles.sectionTitle}>🛒 Articles Favoris</Text>
            <FlatList
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
        paddingBottom: 20,
        backgroundColor: '#00695c',
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
