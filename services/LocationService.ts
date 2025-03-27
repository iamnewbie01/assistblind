import Geolocation from 'react-native-geolocation-service';
import {PermissionsAndroid, Platform} from 'react-native';
import {EventEmitter} from 'events';

export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
  timestamp?: number;
}

export interface LocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  distanceFilter?: number;
  interval?: number;
  fastestInterval?: number;
}

class LocationService {
  private static instance: LocationService;
  private eventEmitter: EventEmitter;
  private watchId: number | null = null;
  private isTracking: boolean = false;
  private lastLocation: Location | null = null;

  private constructor() {
    this.eventEmitter = new EventEmitter();
  }

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  /**
   * Request location permissions
   */
  public async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      const status = await Geolocation.requestAuthorization('whenInUse');
      return status === 'granted';
    }

    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location for navigation.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error('Error requesting location permission:', err);
        return false;
      }
    }

    return false;
  }

  /**
   * Check if location permissions are granted
   */
  public async checkPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        const status = await Geolocation.requestAuthorization('whenInUse');
        return status === 'granted';
      } else {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        return granted;
      }
    } catch (err) {
      console.error('Error checking location permission:', err);
      return false;
    }
  }

  /**
   * Get current location once
   */
  public async getCurrentLocation(
    options?: LocationOptions,
  ): Promise<Location | null> {
    try {
      const hasPermission = await this.checkPermission();
      if (!hasPermission) {
        const granted = await this.requestPermissions();
        if (!granted) {
          this.eventEmitter.emit('error', 'Location permission not granted');
          return null;
        }
      }

      return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          position => {
            const location = this.formatLocation(position);
            this.lastLocation = location;
            this.eventEmitter.emit('locationChanged', location);
            resolve(location);
          },
          error => {
            this.eventEmitter.emit('error', error.message);
            reject(error);
          },
          {
            enableHighAccuracy: options?.enableHighAccuracy ?? true,
            timeout: options?.timeout ?? 15000,
            maximumAge: options?.maximumAge ?? 10000,
          },
        );
      });
    } catch (error) {
      console.error('Error getting current location:', error);
      this.eventEmitter.emit('error', `Failed to get location: ${error}`);
      return null;
    }
  }

  /**
   * Start tracking location
   */
  public async startTracking(
    options?: LocationOptions,
  ): Promise<number | null> {
    try {
      if (this.isTracking) {
        console.warn('Location tracking is already active');
        return this.watchId;
      }

      const hasPermission = await this.checkPermission();
      if (!hasPermission) {
        const granted = await this.requestPermissions();
        if (!granted) {
          this.eventEmitter.emit('error', 'Location permission not granted');
          return null;
        }
      }

      this.watchId = Geolocation.watchPosition(
        position => {
          const location = this.formatLocation(position);
          this.lastLocation = location;
          this.eventEmitter.emit('locationChanged', location);
        },
        error => {
          this.eventEmitter.emit('error', error.message);
        },
        {
          enableHighAccuracy: options?.enableHighAccuracy ?? true,
          distanceFilter: options?.distanceFilter ?? 10, // minimum distance (meters) before updates
          interval: options?.interval ?? 5000, // minimum time (ms) between updates
          fastestInterval: options?.fastestInterval ?? 2000, // fastest time (ms) between updates
        },
      );

      this.isTracking = true;
      this.eventEmitter.emit('trackingStarted', this.watchId);
      return this.watchId;
    } catch (error) {
      console.error('Error starting location tracking:', error);
      this.eventEmitter.emit('error', `Failed to start tracking: ${error}`);
      return null;
    }
  }

  /**
   * Stop tracking location
   */
  public stopTracking(): void {
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      this.watchId = null;
      this.isTracking = false;
      this.eventEmitter.emit('trackingStopped');
    }
  }

  /**
   * Get the last known location
   */
  public getLastLocation(): Location | null {
    return this.lastLocation;
  }

  /**
   * Calculate distance between two locations in meters
   */
  public calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  /**
   * Register event listeners
   */
  public on(event: string, callback: (...args: any[]) => void): void {
    this.eventEmitter.on(event, callback);
  }

  /**
   * Remove event listener
   */
  public off(event: string, callback: (...args: any[]) => void): void {
    this.eventEmitter.off(event, callback);
  }

  /**
   * Format location data from Geolocation API
   */
  private formatLocation(position: any): Location {
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude,
      heading: position.coords.heading,
      speed: position.coords.speed,
      timestamp: position.timestamp,
    };
  }
}

export default LocationService.getInstance();
