const {Client} = require('@googlemaps/google-maps-services-js');

class GoogleMapsService {
  constructor() {
    this.client = new Client({});
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY;
  }

  async reverseGeocode(lat, lng) {
    try {
      const response = await this.client.reverseGeocode({
        params: {
          latlng: `${lat},${lng}`,
          key: this.apiKey,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      throw error;
    }
  }

  async searchPlaces(query, lat, lng, radius = 5000) {
    try {
      const url = 'https://places.googleapis.com/v1/places:searchText';

      const requestBody = {
        textQuery: query,
        locationBias: {
          circle: {
            center: {
              latitude: lat,
              longitude: lng,
            },
            radius: radius,
          },
        },
        languageCode: 'en',
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': this.apiKey,
          'X-Goog-FieldMask':
            'places.id,places.displayName,places.formattedAddress,places.location,places.types,places.rating,places.photos',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${JSON.stringify(
            errorData,
          )}`,
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching places:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }

      console.error('Error stack:', error.stack);
      throw error;
    }
  }

  async getPlaceDetails(placeId) {
    try {
      const url = `https://places.googleapis.com/v1/places/${placeId}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': this.apiKey,
          'X-Goog-FieldMask':
            'id,displayName,formattedAddress,location,photos,rating,types',
        },
      });

      if (!response.ok) {
        console.log(response);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting place details:', error);
      throw error;
    }
  }

  async calculateRoute(origin, destination, mode = 'walking') {
    try {
      const response = await this.client.directions({
        params: {
          origin,
          destination,
          mode,
          alternatives: true,
          key: this.apiKey,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error calculating route:', error);
      throw error;
    }
  }

  async calculateRouteWithRoutesAPI(requestData) {
    try {
      console.log(requestData);
      const response = await fetch(
        'https://routes.googleapis.com/directions/v2:computeRoutes',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': this.apiKey,
            'X-Goog-FieldMask':
              'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.legs,routes.viewport',
          },
          body: JSON.stringify(requestData),
        },
      );

      if (!response.ok) {
        const errorBody = await response.json();
        console.log('Error response body:', JSON.stringify(errorBody, null, 2));
        throw new Error(
          `Routes API request failed with status: ${response.status}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error('Error in Routes API service:', error);
      throw error;
    }
  }
}

module.exports = new GoogleMapsService();
