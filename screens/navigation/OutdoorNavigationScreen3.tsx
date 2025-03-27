import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Text,
} from 'react-native';
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {RouteProp} from '@react-navigation/core';
import {BackButton} from '../../components/Buttons/BackButton';
import {LocationCard} from '../../components/Card/LocationCardDest';
import {ActionButtons} from '../../components/Buttons/ActionButtons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'OutdoorNavigationScreen3'>;
  route: RouteProp<RootStackParamList, 'OutdoorNavigationScreen3'>;
}

const OutdoorNavigationScreen3: React.FC<Props> = ({navigation, route}) => {
  const mapRef = useRef<MapView>(null);

  const locationDetails = route.params?.locationDetails || {
    name: 'Default Location',
    address: 'No address available',
    distance: 'Distance: N/A',
    time: 'Time: N/A',
    coordinates: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
  };

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [routeCoordinates, setRouteCoordinates] = useState<
    Array<{
      latitude: number;
      longitude: number;
    }>
  >([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [navigationStarted, setNavigationStarted] = useState<boolean>(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleStart = () => {
    setNavigationStarted(true);
    // Here you would start real-time navigation updates
    navigation.navigate('OutdoorNavigationScreen4', {locationDetails});
    console.log('Navigation started');
  };

  useEffect(() => {
    // Get user's current location
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setUserLocation({latitude, longitude});

        if (locationDetails.coordinates) {
          fetchRoute({latitude, longitude}, locationDetails.coordinates);
        }
      },
      error => {
        console.log('Error getting location:', error);
        setIsLoading(false);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, );

  const fetchRoute = async (
    origin: {latitude: number; longitude: number},
    destination: {latitude: number; longitude: number},
  ) => {
    try {
      // In a real app, you would use a navigation API like Google Directions API
      // This is a simulated route for demonstration
      setIsLoading(true);

      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create a mocked route (in a real app, this would come from the API)
      const mockRoute = createMockRoute(origin, destination);
      setRouteCoordinates(mockRoute);

      // Fit the map to show the entire route
      if (mapRef.current && mockRoute.length > 0) {
        mapRef.current.fitToCoordinates(mockRoute, {
          edgePadding: {top: 100, right: 100, bottom: 300, left: 100},
          animated: true,
        });
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching route:', error);
      setIsLoading(false);
    }
  };

  // Helper function to create a mock route between two points
  const createMockRoute = (
    origin: {latitude: number; longitude: number},
    destination: {latitude: number; longitude: number},
  ) => {
    // This creates a simple route with 10 points between origin and destination
    const points: Array<{latitude: number; longitude: number}> = [];
    for (let i = 0; i <= 10; i++) {
      const latitude =
        origin.latitude + (destination.latitude - origin.latitude) * (i / 10);
      const longitude =
        origin.longitude +
        (destination.longitude - origin.longitude) * (i / 10);

      // Add some randomness to make it look like a real route
      const randomLat = i > 0 && i < 10 ? (Math.random() - 0.5) * 0.01 : 0;
      const randomLng = i > 0 && i < 10 ? (Math.random() - 0.5) * 0.01 : 0;

      points.push({
        latitude: latitude + randomLat,
        longitude: longitude + randomLng,
      });
    }
    return points;
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0066CC" />
            <Text style={styles.loadingText}>Finding the best route...</Text>
          </View>
        ) : (
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: userLocation?.latitude || 37.78825,
              longitude: userLocation?.longitude || -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation
            followsUserLocation={navigationStarted}>
            {userLocation && (
              <Marker
                coordinate={userLocation}
                title="Your Location"
                description="You are here">
                <View style={styles.userMarker}>
                  <Icon name="person-pin-circle" size={30} color="#0066CC" />
                </View>
              </Marker>
            )}

            {locationDetails.coordinates && (
              <Marker
                coordinate={locationDetails.coordinates}
                title={locationDetails.name}
                description={locationDetails.formatted_address}>
                <View style={styles.destinationMarker}>
                  <Icon name="location-on" size={30} color="#D32F2F" />
                </View>
              </Marker>
            )}

            {routeCoordinates.length > 0 && (
              <Polyline
                coordinates={routeCoordinates}
                strokeWidth={4}
                strokeColor="#0066CC"
              />
            )}
          </MapView>
        )}

        <BackButton onPress={handleBack} />

        {navigationStarted && (
          <View style={styles.navigationInfo}>
            <Icon name="navigation" size={20} color="#FFFFFF" />
            <Text style={styles.navigationText}>
              Navigate to {locationDetails.name}
            </Text>
          </View>
        )}

        <View style={styles.contentWrapper}>
          <View style={styles.cardContainer}>
            <LocationCard location={locationDetails} />
            <ActionButtons onBack={handleBack} onStart={handleStart} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: '#0F172A',
  },
  mapContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333333',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  navigationInfo: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 70,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  navigationText: {
    color: '#FFFFFF',
    marginLeft: 10,
    fontSize: 16,
  },
  contentWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 25,
  },
  cardContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 15,
    width: '100%',
    maxWidth: 340,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
  },
  locationCard: {
    marginBottom: 15,
  },
  locationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  locationAddress: {
    fontSize: 14,
    color: '#CBD5E1',
    marginBottom: 10,
  },
  locationInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  locationInfo: {
    fontSize: 14,
    color: '#94A3B8',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#334155',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  startButton: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  userMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  destinationMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OutdoorNavigationScreen3;