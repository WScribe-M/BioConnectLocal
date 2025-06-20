import React from 'react';
import { LeafletView } from 'react-native-leaflet-view';
import { StyleSheet } from 'react-native';

const Map = ({ markers }) => {

  // Centrer sur le premier marqueur si possible
  const DEFAULT_LOCATION = {
    latitude: markers[0]?.lat || 46.603354,  // fallback sur France
    longitude: markers[0]?.long || 1.888334,
  };

  const leafletMarkers = markers
    .filter(addr => addr.lat && addr.long)
    .map(addr => ({
      id: addr.id?.toString() ?? Math.random().toString(),
      icon:'https://cdn-icons-png.flaticon.com/64/2776/2776067.png',
      size: [64,64],
      iconAnchor:[32,64],
      position:{
          lat: addr.lat,
          lng: addr.long,
      },
    }));

  console.log('leafletMarkers:', leafletMarkers);

  return (
    <LeafletView
      style={styles.map}
      mapMarkers={leafletMarkers}
      zoom={6}
      mapCenterPosition={{
        lat: DEFAULT_LOCATION.latitude,
        lng: DEFAULT_LOCATION.longitude,
      }}

    />
  );
};

const styles = StyleSheet.create({
  map: {
  },
});

export default Map;
