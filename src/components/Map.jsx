import React from 'react';
import { LeafletView } from 'react-native-leaflet-view';
import { StyleSheet } from 'react-native';

const DEFAULT_LOCATION = {
  latitude: -23.5489,
  longitude: -46.6388
}
const Map: React.FC = () => {

  return (
    <LeafletView
      style={styles.map}
      mapCenterPosition={{
        lat: DEFAULT_LOCATION.latitude,
        lng: DEFAULT_LOCATION.longitude,
      }}
    />
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1, // ← très important pour que la map prenne l'espace disponible
  },
});

export default Map;