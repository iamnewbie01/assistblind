import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, SafeAreaView, StatusBar} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {SearchBox} from '../../components/common/SearchBox';
import {BackButton} from '../../components/Buttons/BackButton';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {useVoiceRecognition} from '../../hooks/useVoiceRecognition';
import {useSpeech} from '../../hooks/useSpeech';
import {useGeolocation} from '../../hooks/useGeolocation';
import {CustomButton} from '../../components/Buttons/CustomButton';
import {api} from "../../services/Api";
import {Place} from "../../types/types";

type Props = {
  navigation: StackNavigationProp<
    RootStackParamList,
    'OutdoorNavigationScreen1'
  >;
};

interface PlacesSearchResponse {
  success: boolean;
  places: Place[];
}

const OutdoorNavigationScreen1: React.FC<Props> = ({navigation}) => {
  const {speak, stop} = useSpeech();
  const {
    isListening,
    results,
    partialResults,
    error,
    startListening,
    stopListening,
  } = useVoiceRecognition();
  const {location, getCurrentLocation, error: locationError} = useGeolocation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(true);
  const [destination, setDestination] = useState<string>('');
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(true);
  const initialAnnouncementMade = useRef<boolean>(false);

  useEffect(() => {
    const fetchLocation = async () => {
      setIsLoadingLocation(true);
      try {
        await getCurrentLocation();
      } catch (err) {
        console.error('Failed to get location:', err);
      } finally {
        setIsLoadingLocation(false);
      }
    };

    fetchLocation();
  }, []);

  useEffect(() => {
    if (location && !initialAnnouncementMade.current) {
      initialAnnouncementMade.current = true;
      speak(
        'Your location has been found. Tap the search button and say where you want to go.',
      );
    }
  }, [location]);

  useEffect(() => {
    if (locationError) {
      speak(
        `Location error: ${locationError}. Please make sure location services are enabled.`,
      );
    }
  }, [locationError]);

  useEffect(() => {
    if (results.length > 0) {
      setDestination(results[0]);
      speak(
        `You said: ${results[0]}. Is this correct? If not, press the search button again. Otherwise, tap the confirm button to proceed.`,
      );
    }
  }, [results]);

  useEffect(() => {
    if (error) {
      speak(`Error: ${error}. Please try again.`);
    }
  }, [error]);

  const handleSearchPress = async () => {
    if (isListening) {
      await stopListening();
    } else {
      speak('Please say your destination', {
        onDone: async () => {
          // Start listening only after speech is complete
          await startListening({
            language: 'en-IN',
            maxDuration: 100000,
          });
        },
      });
    }
  };

  const handleConfirmDestination = async () => {
    try{
      if (destination && location) {
        speak(`Navigating to ${destination}`);
        const placesDetails = await api.post<PlacesSearchResponse>('/api/places/search', {
          query: destination,
          latitude: location.latitude,
          longitude: location.longitude
        });
        console.log(placesDetails);
        const result: Place[] = placesDetails.data.places;
        navigation.navigate('OutdoorNavigationScreen2', {
          locations: result,
          userLocation: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
        });
      } else if (!destination) {
        speak('Please set a destination first');
      } else {
        speak('Waiting for your location. Please try again in a moment.');
      }
    } catch(error){
      speak('Please try again later!');
      console.log(error);
      navigation.navigate("MainMenuScreen");
    } 
  };

  const handleBackPress = async () => {
    await stop();
    await stopListening();
    navigation.navigate('MainMenuScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Map View */}
      <View style={styles.mapContainer}>
        {isLoadingLocation ? (
          <View></View>
        ) : location ? (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={{
              ...location,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation
            showsMyLocationButton
            showsCompass
            showsScale>
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Your Location"
            />
          </MapView>
        ) : (
          <View></View>
        )}
      </View>

      {/* Header with Back Button and Search */}
      <View style={styles.header}>
        {/* Using your existing BackButton component */}
        <BackButton onPress={handleBackPress} />

        {/* Search Component */}
        <View style={styles.searchContainer}>
          <SearchBox onPress={handleSearchPress} />
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.confirmContainer}>
          <CustomButton title="Confirm Destination" onPress={handleConfirmDestination} disabled={false}/>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
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
  searchContainer: {
    flex: 1,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 1,
  },
  confirmContainer: {
    flex: 1,
  },
});

export default OutdoorNavigationScreen1;
