import {useState, useEffect, useCallback, useRef} from 'react';
import LocationService, {
  Location,
  LocationOptions,
} from '../services/LocationService';

export const useGeolocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const watchId = useRef<number | null>(null);

  // Check permission on mount
  useEffect(() => {
    const checkPermission = async () => {
      const permission = await LocationService.checkPermission();
      setHasPermission(permission);
    };

    checkPermission();
  }, []);

  // Set up event listeners
  useEffect(() => {
    const handleLocationChanged = (newLocation: Location) => {
      setLocation(newLocation);
      setError(null);
    };

    const handleError = (errorMessage: string) => {
      setError(errorMessage);
    };

    LocationService.on('locationChanged', handleLocationChanged);
    LocationService.on('error', handleError);
    LocationService.on('trackingStarted', () => setIsTracking(true));
    LocationService.on('trackingStopped', () => setIsTracking(false));

    // Cleanup function
    return () => {
      LocationService.off('locationChanged', handleLocationChanged);
      LocationService.off('error', handleError);
      if (isTracking) {
        LocationService.stopTracking();
      }
    };
  }, [isTracking]);

  // Request location permissions
  const requestPermissions = useCallback(async () => {
    try {
      const granted = await LocationService.requestPermissions();
      setHasPermission(granted);
      return granted;
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      return false;
    }
  }, []);

  // Get current location once
  const getCurrentLocation = useCallback(
    async (options?: LocationOptions) => {
      try {
        setError(null);

        if (hasPermission === false) {
          const granted = await requestPermissions();
          if (!granted) {
            setError('Location permission not granted');
            return null;
          }
        }

        const currentLocation = await LocationService.getCurrentLocation(
          options,
        );
        if (currentLocation) {
          setLocation(currentLocation);
        }
        return currentLocation;
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        return null;
      }
    },
    [hasPermission, requestPermissions],
  );

  // Start tracking location
  const startTracking = useCallback(
    async (options?: LocationOptions) => {
      try {
        setError(null);

        if (hasPermission === false) {
          const granted = await requestPermissions();
          if (!granted) {
            setError('Location permission not granted');
            return null;
          }
        }

        const id = await LocationService.startTracking(options);
        if (id) {
          watchId.current = id;
          setIsTracking(true);
        }
        return id;
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        return null;
      }
    },
    [hasPermission, requestPermissions],
  );

  // Stop tracking location
  const stopTracking = useCallback(() => {
    LocationService.stopTracking();
    watchId.current = null;
    setIsTracking(false);
  }, []);

  // Calculate distance between two points
  const calculateDistance = useCallback(
    (lat1: number, lon1: number, lat2: number, lon2: number): number => {
      return LocationService.calculateDistance(lat1, lon1, lat2, lon2);
    },
    [],
  );

  return {
    location,
    error,
    isTracking,
    hasPermission,
    requestPermissions,
    getCurrentLocation,
    startTracking,
    stopTracking,
    calculateDistance,
  };
};
