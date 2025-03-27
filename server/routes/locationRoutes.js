const express = require('express');
const router = express.Router();
const googleMapsService = require('../services/googleMapsService');

// Reverse geocode a location
router.post('/reverse-geocode', async (req, res) => {
  try {
    const {latitude, longitude} = req.body;

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({error: 'Latitude and longitude are required'});
    }

    const result = await googleMapsService.reverseGeocode(latitude, longitude);

    res.json({
      success: true,
      address: result.results[0]?.formatted_address || 'Unknown location',
      placeDetails: result.results[0],
    });
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    res.status(500).json({error: 'Failed to get location details'});
  }
});

module.exports = router;
