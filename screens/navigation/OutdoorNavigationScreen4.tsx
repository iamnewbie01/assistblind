import React, {useState, useEffect, useRef} from 'react';
import {View, Image, StyleSheet, Alert, AccessibilityInfo} from 'react-native';
import {BackButton} from '../../components/Buttons/BackButton';
import {ContentCard} from '../../components/Card/ContentCard';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {RouteProp} from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import navigationService from '../../services/NavigationService';
import {decode} from '@mapbox/polyline';
import SpeechService from '../../services/SpeechService';
import ObstacleDetectionApp from './ObstacleDetection';
import {REACT_SERVER_HOST, REACT_PORT} from '../../env';

const WS_URL = `ws://${REACT_SERVER_HOST}:${REACT_PORT}`;

type Props = {
  navigation: StackNavigationProp<
    RootStackParamList,
    'OutdoorNavigationScreen4'
  >;
  route: RouteProp<RootStackParamList, 'OutdoorNavigationScreen4'>;
};

const NavigationContainer: React.FC<Props> = ({navigation, route}) => {
  const {locationDetails, userLocation} = route.params;
  const [currentUserLocation, setCurrentUserLocation] = useState(userLocation);
  const watchId = useRef<number | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [routePolyline, setRoutePolyline] = useState<any[]>([]);
  const [navigationInfo, setNavigationInfo] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<any>(null);
  const [nextManeuver, setNextManeuver] = useState<any>(null);
  const [distanceToNextStep, setDistanceToNextStep] = useState<number>(0);
  const [distanceToDestination, setDistanceToDestination] = useState<number>(0);
  const [timeToDestination, setTimeToDestination] = useState<number>(0);
  const [voiceInstruction, setVoiceInstruction] = useState<string>('');
  const [isOnRoute, setIsOnRoute] = useState<boolean>(true);

  useEffect(() => {
    navigationService.connect(WS_URL);

    // Set up event listeners
    navigationService.on('navigationStarted', handleNavigationStarted);
    navigationService.on('navigationUpdate', handleNavigationUpdate);
    navigationService.on('routeRecalculated', handleRouteRecalculated);
    navigationService.on('destinationReached', handleDestinationReached);
    navigationService.on('navigationError', handleNavigationError);

    // Start watching position
    startWatchingPosition();

    // Clean up on unmount
    return () => {
      if (watchId.current !== null) {
        Geolocation.clearWatch(watchId.current);
      }

      navigationService.removeAllListeners();
      navigationService.endNavigation();
      navigationService.disconnect();

      // Stop any ongoing speech
      SpeechService.stop();
    };
  }, []);
  const startWatchingPosition = () => {
    watchId.current = Geolocation.watchPosition(
      position => {
        const {latitude, longitude, heading, speed} = position.coords;
        const newLocation = {latitude: latitude, longitude: longitude};

        setCurrentUserLocation(newLocation);

        // Update position in navigation service if navigation is active
        if (isNavigating) {
          navigationService.updatePosition({
            lat: latitude,
            lng: longitude,
            heading,
            speed,
          });
        }
      },
      error => console.error('Error getting location', error),
      {enableHighAccuracy: true, distanceFilter: 5, interval: 1000},
    );
  };
  useEffect(() => {
    if (userLocation && !isNavigating) {
      startNavigation();
    }
  }, [userLocation]);
  const startNavigation = async () => {
    if (!userLocation) return;

    await navigationService.startNavigation({
      originLat: userLocation.latitude,
      originLng: userLocation.longitude,
      ...(locationDetails.id
        ? {destinationPlaceId: locationDetails.id}
        : {
            destinationLat: locationDetails.coordinates.latitude,
            destinationLng: locationDetails.coordinates.longitude,
          }),
    });
  };
  const handleNavigationStarted = (data: any) => {
    setIsNavigating(true);

    // Decode polyline
    const points = decode(data.route.overview_polyline.points);
    const decodedCoords = points.map(point => ({
      latitude: point[0],
      longitude: point[1],
    }));

    setRoutePolyline(decodedCoords);
    setNavigationInfo({
      steps: data.route.steps,
      distance: data.route.distance,
      duration: data.route.duration,
      currentStepIndex: 0,
    });

    // Extract the first step as the next maneuver
    if (data.route.steps && data.route.steps.length > 0) {
      const firstStep = data.route.steps[0];
      console.log(firstStep);
      setNextManeuver({
        instruction: firstStep.instructions,
        maneuver: firstStep.maneuver,
      });
      setDistanceToNextStep(firstStep.distance.value);
      SpeechService.speak(firstStep.instructions);
    }
  };
  const handleNavigationUpdate = (data: any) => {
    // Update current step
    setCurrentStep(data.currentStep);

    // Extract next maneuver from route steps based on currentStepIndex
    const currentStepIndex = data.currentStepIndex || 0;
    const routeSteps = data.route?.steps || [];

    if (currentStepIndex < routeSteps.length) {
      const nextStep = routeSteps[currentStepIndex];
      setNextManeuver({
        instruction: nextStep.instructions,
        maneuver: nextStep.maneuver,
      });
      setDistanceToNextStep(data.distanceToNextStep || nextStep.distance.value);
      SpeechService.speak(nextStep.instructions);
    }

    // Update other navigation data
    setDistanceToDestination(data.distanceToDestination);
    setTimeToDestination(data.timeToDestination);
    setIsOnRoute(data.isOnRoute);
  };
  const handleRouteRecalculated = (data: any) => {
    // Decode new polyline
    const points = decode(data.route.overview_polyline.points);
    const decodedCoords = points.map(point => ({
      latitude: point[0],
      longitude: point[1],
    }));

    setRoutePolyline(decodedCoords);
    setNavigationInfo({
      steps: data.route.steps,
      distance: data.route.distance,
      duration: data.route.duration,
      currentStepIndex: 0,
    });

    SpeechService.speak('Route recalculated');
  };
  const handleDestinationReached = () => {
    setIsNavigating(false);
    SpeechService.speak('You have arrived at your destination', {
      onDone: () => {
        Alert.alert(
          'Destination Reached',
          'You have arrived at your destination!',
          [{text: 'OK', onPress: () => navigation.navigate('MainMenuScreen')}],
        );
        AccessibilityInfo.announceForAccessibility(
          'Press OK to continue to Main screen.',
        );
      },
    });
  };

  // Handle navigation errors
  const handleNavigationError = (error: any) => {
    Alert.alert(
      'Navigation Error',
      'Internal error occured, please try again later!!',
    );
    AccessibilityInfo.announceForAccessibility(
      'An unexpected error occured, please try again later!!',
    );
    navigation.navigate('MainMenuScreen');
    setIsNavigating(false);
  };

  const handleBackPress = () => {
    // Handle back navigation
    navigation.goBack();
  };

  const handlePause = () => {
    // Handle pause action
    SpeechService.speak(`${nextManeuver?.instruction || 'Loading...'}`);
  };

  const handleEnd = () => {
    SpeechService.speak('Navigation ended', {
      onDone: () => {
        navigationService.endNavigation();
        setIsNavigating(false);
        navigation.navigate('MainMenuScreen');
      },
    });
  };

  return (
    <View style={styles.container}>
      <BackButton
        onPress={handleBackPress}
        activeOpacity={0.9}
        accessible={true}
        accessibilityLabel="Tap to go back"
        accessibilityHint="Tap to go back"
      />

      <ObstacleDetectionApp outdoor={1} />
      <View style={styles.bottomPanel}>
        <ContentCard
          onPause={handlePause}
          onEnd={handleEnd}
          nextInstruction={`${nextManeuver?.instruction || 'Loading...'} in ${
            Math.round(distanceToNextStep * 100) / 100
          } meters`}
          destination={locationDetails.name}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: '#0F172A',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    // padding: 24,
  },
});

export default NavigationContainer;
