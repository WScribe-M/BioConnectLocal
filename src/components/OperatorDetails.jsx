import {Button, Linking, StyleSheet, Text, View} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';

const OperatorDetails = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Nom de l'opérateur</Text>
            <Text style={styles.text}>Adresse: Adresse de l'opérateur</Text>
            <Text style={styles.text}>SIRET: Numéro de SIRET</Text>
            <Text style={styles.text}>Activités: Activités de l'opérateur (Production, Préparation, etc.)</Text>
            <Text style={styles.text}>Produit listés:</Text>
            <View style={styles.itemContainer}>
                <View>
                    <Text style={styles.itemTitle}>Produit 1</Text>
                    <Text style={styles.itemDescription}>Description du produit 1</Text>
                </View>
                <Ionicons name="star-outline" size={25} color="#2196f3" />
            </View>
            <View style={styles.itemContainer}>
                <View>
                    <Text style={styles.itemTitle}>Produit 2</Text>
                    <Text style={styles.itemDescription}>Description du produit 2</Text>
                </View>
                <Ionicons name="star-outline" size={25} color="#2196f3" />
            </View>
            <Text style={styles.text}>Numéro Bio</Text>
            <Button
                title="Site web de l'opérateur"
                onPress={() => Linking.openURL('https://google.com')}
            />
            <Button
                title="Téléphoner à l'opérateur"
                onPress={() => Linking.openURL('tel:0123456789')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F5FCFF',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    text: {
        fontSize: 16,
        marginTop: 15,
        marginBottom: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#eaeaea',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemDescription: {
        fontSize: 14,
        color: '#555',
    }
})

export default OperatorDetails;