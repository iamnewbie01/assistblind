import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {BackButton} from '../../components/Buttons/BackButton';
import {SearchBox} from '../../components/common/SearchBox';
import {Place} from '../../types/types';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {ScrollView} from 'react-native-gesture-handler';
import {RouteProp} from '@react-navigation/native';

function formatTime(seconds: number): string {
  // Handle negative values
  const isNegative = seconds < 0;
  seconds = Math.abs(seconds);

  // Extract whole seconds and milliseconds
  const wholeSeconds = Math.floor(seconds);
  const milliseconds = Math.round((seconds - wholeSeconds) * 1000);

  // Calculate hours, minutes, and remaining seconds
  const hours = Math.floor(wholeSeconds / 3600);
  const minutes = Math.floor((wholeSeconds % 3600) / 60);
  const remainingSeconds = wholeSeconds % 60;

  // Format with padding
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  // Create the base time string

  let timeString = `${formattedMinutes} Mins ${formattedSeconds} Secs`;

  // Add milliseconds if present
  if (hours > 0) {
    timeString = `${formattedHours} Hrs` + timeString;
  }

  // Add negative sign if needed
  return isNegative ? `-${timeString}` : timeString;
}

function truncateToTwoDecimals(num: number): number {
  const multiplier = Math.pow(10, 2);
  return Math.trunc(num * multiplier) / multiplier;
}

type Props = {
  navigation: StackNavigationProp<
    RootStackParamList,
    'OutdoorNavigationScreen2'
  >;
  route: RouteProp<RootStackParamList, 'OutdoorNavigationScreen2'>;
};

const OutdoorNavigation2: React.FC<Props> = ({navigation, route}) => {
  const {locations, userLocation} = route.params;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );

  const handleBackPress = () => {
    navigation.navigate('OutdoorNavigationScreen1');
  };

  const handleSearch = () => {
    // Navigate to search results screen
    navigation.navigate('OutdoorNavigationScreen2', {locations, userLocation});
  };

  const handleLocationSelect = (locationDetails: Place) => {
    navigation.navigate('OutdoorNavigationScreen4', {locationDetails, userLocation});
    // You could implement navigation to this location here
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header with back button */}
      <View style={styles.header}>
        <BackButton onPress={handleBackPress} />
        <SearchBox onPress={handleSearch} />
      </View>

      {/* Map View */}
      {/* <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            ...userLocation,
            latitudeDelta: 0,
            longitudeDelta: 0,
          }}>
          {locations.map((location, index) => (
            <Marker
              key={index}
              coordinate={location.coordinates}
              title={location.name}
              description={location.formatted_address}
            />
          ))}
        </MapView>
      </View> */}

      <View style={styles.resultsContainer}>
        <ScrollView style={styles.scrollView}>
          {locations.map((location, index) => (
            <TouchableOpacity
              key={index}
              style={styles.locationItem}
              onPress={() => handleLocationSelect(location)}>
              <View style={styles.locationIconContainer}>
                <View style={styles.locationIcon}>
                  <Text style={styles.locationIconText}>📍</Text>
                </View>
              </View>
              <View style={styles.locationInfo}>
                <Text style={styles.locationName}>{location.name}</Text>
                <Text style={styles.detail}>{`${truncateToTwoDecimals(
                  location.distance,
                )} kilometers`}</Text>
                <Text style={styles.detail}>
                  {formatTime((location.distance * 1000) / 1.3)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 1,
  },
  backButton: {
    padding: 5,
  },
  searchContainer: {
    flex: 1,
    marginLeft: 8,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  mapContainer: {
    height: '40%',
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  locationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  locationIconContainer: {
    marginRight: 16,
    justifyContent: 'center',
  },
  locationIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationIconText: {
    fontSize: 18,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  locationAddress: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  locationDistance: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: '#64748B',
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 140,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  detail: {
    color: '#475569',
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 16,
  },
});

export default OutdoorNavigation2;
