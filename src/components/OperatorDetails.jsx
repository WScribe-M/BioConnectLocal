import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ProducteurScreen({ route, navigation }) {
    const { producteur } = route.params;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Ionicons name="leaf" size={32} color="#fff" />
                <Text style={styles.headerTitle}>{producteur.nom}</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>📍 Adresse :</Text>
                    <Text style={styles.cardContent}>{producteur.adresse}</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>🆔 Identifiant :</Text>
                    <Text style={styles.cardContent}>{producteur.operator_id}</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>🥕 Produits proposés :</Text>
                    <Text style={styles.cardContent}>Fruits et légumes bio, produits frais, produits d'épicerie...</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>🕑 Horaires :</Text>
                    <Text style={styles.cardContent}>Du lundi au vendredi : 9h - 18h</Text>
                    <Text style={styles.cardContent}>Samedi : 10h - 16h</Text>
                    <Text style={styles.cardContent}>Dimanche : Fermé</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f7f4',
    },
    header: {
        backgroundColor: '#4caf50',
        paddingTop: 50,
        paddingBottom: 20,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    backButton: {
        position: 'absolute',
        left: 20,
        top: 55,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 26,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    content: {
        padding: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 5,
        elevation: 4,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    cardContent: {
        fontSize: 15,
        color: '#555',
        marginLeft: 10,
    },
});