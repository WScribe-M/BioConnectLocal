import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // npm install react-native-linear-gradient
import Ionicons from 'react-native-vector-icons/Ionicons';

const Accueil = ({ navigation }) => {
    return (
        <LinearGradient colors={['#4caf50', '#357a38']} style={styles.bg}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Ionicons name="leaf" size={60} color="#fff" style={styles.logo} />
                    <Text style={styles.title}>Bienvenue sur BioConnect</Text>
                    <Text style={styles.subtitle}>Trouvez et soutenez les meilleurs producteurs bio près de chez vous 🌱</Text>
                </View>

                <View style={styles.btnContainer}>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#fff' }]}
                        onPress={() => navigation.navigate('FavorisScreen')}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="star" size={24} color="#4caf50" />
                        <Text style={[styles.btnText, { color: '#4caf50' }]}>Mes Favoris</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#4caf50', marginTop: 15 }]}
                        onPress={() => navigation.navigate('Search')}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="search" size={24} color="#fff" />
                        <Text style={[styles.btnText, { color: '#fff' }]}>Rechercher</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    bg: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    header: {
        alignItems: 'center',
        marginBottom: 60,
    },
    logo: {
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 8,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        textShadowColor: '#2227',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 17,
        color: '#e0ffe6',
        textAlign: 'center',
        fontStyle: 'italic',
        marginBottom: 5,
    },
    btnContainer: {
        width: '100%',
        alignItems: 'center',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 220,
        justifyContent: 'center',
        paddingVertical: 15,
        borderRadius: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
    },
    btnText: {
        fontSize: 19,
        fontWeight: 'bold',
        marginLeft: 8,
        letterSpacing: 1,
    },
});

export default Accueil;