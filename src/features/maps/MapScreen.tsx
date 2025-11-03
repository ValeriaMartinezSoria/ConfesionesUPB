import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import MapView, { Marker, Callout, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { MAP_POINTS, MapPoint } from './points';
import { useUserStore } from '../../../app/store/useUserStore';

// Región por defecto en La Paz como fallback
const DEFAULT_REGION: Region = {
  latitude: -16.5752089,
  longitude: -68.1270692,
  latitudeDelta: 0.15,
  longitudeDelta: 0.15,
};

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Obtener usuario y loading del store
  const user = useUserStore((s) => s.user);
  const loading = useUserStore((s) => s.loading);

  // Solicitar permisos de ubicación y obtener la ubicación del usuario
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          setHasLocationPermission(true);
          const location = await Location.getCurrentPositionAsync({});
          const userCoords = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          setUserLocation(userCoords);

          // Centrar el mapa en la ubicación del usuario
          setRegion({
            ...userCoords,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
        } else {
          // Si no hay permiso, usar fallback (La Paz)
          setHasLocationPermission(false);
        }
      } catch (error) {
        console.error('Error al obtener ubicación:', error);
      }
    })();
  }, []);

  // Función para abrir en mapas externos
  const openInMaps = (point: MapPoint) => {
    const url = point.url || `geo:${point.latitude},${point.longitude}`;

    const fallbackUrl = Platform.select({
      ios: `http://maps.apple.com/?ll=${point.latitude},${point.longitude}&q=${encodeURIComponent(point.title)}`,
      android: `geo:${point.latitude},${point.longitude}?q=${point.latitude},${point.longitude}(${encodeURIComponent(point.title)})`,
      default: point.url || `https://www.google.com/maps/search/?api=1&query=${point.latitude},${point.longitude}`,
    });

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          return Linking.openURL(fallbackUrl);
        }
      })
      .catch((err) => {
        console.error('Error al abrir mapas:', err);
        Alert.alert('Error', 'No se pudo abrir la aplicación de mapas');
      });
  };

  // FAB: Ver todos los puntos
  const handleViewAll = () => {
    if (mapRef.current) {
      const coordinates = MAP_POINTS.map((p) => ({
        latitude: p.latitude,
        longitude: p.longitude,
      }));
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
        animated: true,
      });
    }
  };

  // FAB: Mi ubicación o fallback a La Paz
  const handleMyLocation = () => {
    if (hasLocationPermission && userLocation) {
      setRegion({
        ...userLocation,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      mapRef.current?.animateToRegion({
        ...userLocation,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }, 1000);
    } else {
      // Fallback a La Paz
      setRegion(DEFAULT_REGION);
      mapRef.current?.animateToRegion(DEFAULT_REGION, 1000);
      Alert.alert(
        'Ubicación no disponible',
        'No se pudo obtener tu ubicación. Mostrando La Paz como referencia.'
      );
    }
  };

  // FAB: Solo puntos de La Paz
  const handleOnlyLaPaz = () => {
    if (mapRef.current) {
      const laPazPoints = MAP_POINTS.filter((p) => p.city === 'La Paz');
      const coordinates = laPazPoints.map((p) => ({
        latitude: p.latitude,
        longitude: p.longitude,
      }));
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
        animated: true,
      });
    }
  };

  // Si está cargando, no mostrar nada
  if (loading) {
    return null;
  }

  // Si no hay usuario, mostrar mensaje de login
  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="lock-closed" size={64} color="#999" />
        <Text style={styles.noUserText}>
          Necesitas iniciar sesión para ver el mapa.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={hasLocationPermission}
        showsMyLocationButton={false}
      >
        {MAP_POINTS.map((point) => (
          <Marker
            key={point.id}
            coordinate={{
              latitude: point.latitude,
              longitude: point.longitude,
            }}
            pinColor={point.kind === 'UPB' ? '#3498db' : '#2ecc71'}
          >
            <Callout onPress={() => openInMaps(point)}>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{point.title}</Text>
                {point.subtitle && (
                  <Text style={styles.calloutSubtitle}>{point.subtitle}</Text>
                )}
                <Text style={styles.calloutKind}>
                  {point.kind === 'UPB' ? '🎓 Campus UPB' : '📍 Punto de interés'}
                </Text>
                <View style={styles.calloutButton}>
                  <Ionicons name="navigate" size={14} color="#3498db" />
                  <Text style={styles.calloutButtonText}>Abrir en mapas</Text>
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* FABs flotantes */}
      <View style={styles.fabContainer}>
        <Pressable
          style={[styles.fab, styles.fabPrimary]}
          onPress={handleViewAll}
          android_ripple={{ color: '#2c3e50' }}
        >
          <Ionicons name="expand" size={20} color="white" />
          <Text style={styles.fabText}>Ver todos</Text>
        </Pressable>

        <Pressable
          style={[styles.fab, styles.fabPrimary]}
          onPress={handleMyLocation}
          android_ripple={{ color: '#2c3e50' }}
        >
          <Ionicons name="locate" size={20} color="white" />
          <Text style={styles.fabText}>Mi ubicación</Text>
        </Pressable>

        <Pressable
          style={[styles.fab, styles.fabSecondary]}
          onPress={handleOnlyLaPaz}
          android_ripple={{ color: '#2c3e50' }}
        >
          <Ionicons name="pin" size={20} color="white" />
          <Text style={styles.fabText}>Solo La Paz</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  noUserText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
  callout: {
    width: 200,
    padding: 10,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  calloutSubtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  calloutKind: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  calloutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  calloutButtonText: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '600',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 16,
    gap: 12,
  },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabPrimary: {
    backgroundColor: '#34495e',
  },
  fabSecondary: {
    backgroundColor: '#2c3e50',
  },
  fabText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
});
