// services/navigationService.ts
import io, { Socket } from 'socket.io-client';
import { EventEmitter } from 'events';

class NavigationService extends EventEmitter {
  private socket: Socket | null = null;
  private navigationId: string | null = null;
  private isConnected: boolean = false;
  private connectionPromise: Promise<void> | null = null;
  
  // Connect to the WebSocket server
  connect(serverUrl: string): Promise<void> {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }
    if (this.isConnected && this.socket) {
      return Promise.resolve();
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      // Disconnect existing socket if any
      if (this.socket) {
        this.socket.disconnect();
      }
      
      console.log('Attempting to connect to:', serverUrl);
      
      // Create new socket with explicit websocket transport
      this.socket = io(serverUrl, {
        transports: ['websocket'],
        reconnection: true,
        timeout: 10000
      });
      
      // Set a connection timeout
      const timeoutId = setTimeout(() => {
        reject(new Error('Connection timeout after 10 seconds'));
        this.connectionPromise = null;
      }, 10000);
      this.socket.on('connect', () => {
        console.log('Connected to navigation server');
        this.isConnected = true;
        clearTimeout(timeoutId);
        this.emit('connectionChange', true);
        resolve();
        this.connectionPromise = null;
      });
      
      // Handle connection error
      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        clearTimeout(timeoutId);
        this.isConnected = false;
        reject(error);
        this.connectionPromise = null;
      });
      this.socket.on('disconnect', () => {
        console.log('Disconnected from navigation server');
        this.isConnected = false;
        this.emit('connectionChange', false);
      });
      
      // Set up other event listeners
      if (this.socket) {
        this.setupEventListeners(this.socket);
      }
    });
    return this.connectionPromise;
  }

  private setupEventListeners(socket: Socket): void {
    socket.on('navigationStarted', (data) => {
      this.navigationId = data.navigationId;
      this.emit('navigationStarted', data);
    });
    
    socket.on('navigationUpdate', (data) => {
      this.emit('navigationUpdate', data);
    });
    
    socket.on('routeRecalculated', (data) => {
      this.emit('routeRecalculated', data);
    });
    
    socket.on('destinationReached', () => {
      this.emit('destinationReached');
    });
    socket.on('navigationEnded', () => {
      this.navigationId = null;
      this.emit('navigationEnded');
    });
    
    socket.on('navigationError', (error) => {
      this.emit('navigationError', error);
    });
  }
  
  // Start navigation with origin and destination
  async startNavigation(params: {
    originLat: number;
    originLng: number;
    destinationLat?: number;
    destinationLng?: number;
    destinationPlaceId?: string;
  }): Promise<void> {
    // Ensure we're connected before proceeding
    try {
      await this.connect('ws://172.20.50.186:5000');
      
      if (!this.socket) {
        throw new Error('Socket is null after connection');
      }
      
      console.log('Emitting startNavigation event with params:', params);
      this.socket.emit('startNavigation', params);
    } catch (error) {
      console.error('Failed to start navigation:', error);
      throw error;
    }
  }
  
  // Update user position during navigation
  updatePosition(position: {
    lat: number;
    lng: number;
    heading?: number|null;
    speed?: number|null;
  }) {
    if (!this.isConnected || !this.socket) {
      return;
    }
    
    this.socket.emit('updatePosition', position);
  }
  
  // End navigation session
  endNavigation() {
    if (!this.isConnected || !this.socket) {
      return;
    }
    
    this.socket.emit('endNavigation');
    this.navigationId = null;
  }
  
  // Disconnect from server
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.navigationId = null;
    }
  }
  
  // Check if navigation is active
  isNavigating() {
    return this.navigationId !== null;
  }
}

// Create singleton instance
const navigationService = new NavigationService();
export default navigationService;
