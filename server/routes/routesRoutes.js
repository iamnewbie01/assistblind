const express = require('express');
const router = express.Router();
const googleMapsService = require('../services/googleMapsService');

// Calculate route
router.post('/calculate', async (req, res) => {
  try {
    const {
      originLat,
      originLng,
      destinationLat,
      destinationLng,
      destinationPlaceId,
    } = req.body;

    if (
      !originLat ||
      !originLng ||
      ((!destinationLat || !destinationLng) && !destinationPlaceId)
    ) {
      return res.status(400).json({
        error:
          'Origin coordinates and either destination coordinates or place ID are required',
      });
    }

    // Prepare request data for Routes API
    const requestData = {
      origin: {
        location: {
          latLng: {
            latitude: originLat,
            longitude: originLng,
          },
        },
      },
      destination: destinationPlaceId
        ? {placeId: destinationPlaceId}
        : {
            location: {
              latLng: {
                latitude: destinationLat,
                longitude: destinationLng,
              },
            },
          },
      travelMode: 'WALK',
    };

    const result = await googleMapsService.calculateRouteWithRoutesAPI(
      requestData,
    );

    res.json({
      success: true,
      routes: result.routes,
    });
  } catch (error) {
    console.error('Error calculating route:', error);
    res.status(500).json({error: 'Failed to calculate route'});
  }
});

module.exports = router;
