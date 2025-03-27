const express = require('express');
const router = express.Router();
const googleMapsService = require('../services/googleMapsService');
const NavigationUtils = require('../utils/navigationUtils');

// Search for places
router.post('/search', async (req, res) => {
  try {
    const {query, latitude, longitude, radius = 5000} = req.body;

    if (!query || !latitude || !longitude) {
      return res
        .status(400)
        .json({error: 'Query, latitude, and longitude are required'});
    }

    const result = await googleMapsService.searchPlaces(
      query,
      latitude,
      longitude,
      radius,
    );

    return res.json({
      success: true,
      places: result.places.map(place => {
        const distance = NavigationUtils.calculateDistance(
          latitude,
          longitude,
          place.location.latitude,
          place.location.longitude,
        ) / 1000;
        return {
          id: place.placeId,
          name: place.displayName.text,
          address: place.formatted_address,
          distance,
          coordinates: {
            latitude: place.location.latitude,
            longitude: place.location.longitude,
          },
        };
      }),
    });
  } catch (error) {
    console.error('Error searching places:', error);
    res.status(500).json({error: 'Failed to search places'});
  }
});

// Get place details
router.get('/details/:placeId', async (req, res) => {
  try {
    const {placeId} = req.params;

    if (!placeId) {
      return res.status(400).json({error: 'Place ID is required'});
    }

    const result = await googleMapsService.getPlaceDetails(placeId);

    res.json({
      success: true,
      placeDetails: result,
    });
  } catch (error) {
    console.error('Error getting place details:', error);
    res.status(500).json({error: 'Failed to get place details'});
  }
});

module.exports = router;
