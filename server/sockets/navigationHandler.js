const googleMapsService = require('../services/googleMapsService');
const NavigationUtils = require('../utils/navigationUtils');

// Store active navigation sessions
const navigationSessions = new Map();

module.exports = function (io, socket) {
  // Start navigation session
  socket.on('startNavigation', async data => {
    try {
      const {
        originLat,
        originLng,
        destinationLat,
        destinationLng,
        destinationPlaceId,
      } = data;

      console.log('From the sockets');

      // Validate input
      if (
        !originLat ||
        !originLng ||
        ((!destinationLat || !destinationLng) && !destinationPlaceId)
      ) {
        socket.emit('navigationError', {
          error:
            'Origin coordinates and either destination coordinates or place ID are required',
        });
        return;
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
        polylineQuality: 'OVERVIEW',
        languageCode: "en",
      };

      // Get route from Google Routes API
      const routeData = await googleMapsService.calculateRouteWithRoutesAPI(
        requestData,
      );

      if (!routeData.routes || routeData.routes.length === 0) {
        socket.emit('navigationError', {error: 'No routes found'});
        return;
      }

      const route = routeData.routes[0];
      const navigationId = Date.now().toString();

      // Process route steps for easier consumption by the client
      // Note: Routes API returns legs differently than Directions API
      const processedSteps = route.legs[0].steps.map(step => ({
        instructions: step.navigationInstruction?.instructions || '',
        distance: {
          text: `${Math.round(step.distanceMeters / 100) / 10} km`,
          value: step.distanceMeters,
        },
        duration: {
          text: `${Math.round(
            parseInt(step.staticDuration.replace('s', '')) / 60,
          )} mins`,
          value: parseInt(step.staticDuration.replace('s', '')),
        },
        startLocation: {
          lat: step.startLocation.latLng.latitude,
          lng: step.startLocation.latLng.longitude,
        },
        endLocation: {
          lat: step.endLocation.latLng.latitude,
          lng: step.endLocation.latLng.longitude,
        },
        maneuver: step.navigationInstruction?.maneuver || '',
        polyline: {
          points: step.polyline.encodedPolyline,
        },
      }));

      // Store navigation session data
      navigationSessions.set(socket.id, {
        navigationId,
        route,
        destination: destinationPlaceId
          ? {
              lat: route.legs[0].endLocation.latLng.latitude,
              lng: route.legs[0].endLocation.latLng.longitude,
            }
          : {lat: destinationLat, lng: destinationLng},
        currentStepIndex: 0,
        lastPosition: {lat: originLat, lng: originLng},
      });

      console.log({
        navigationId,
        route: {
          overview_polyline: {
            points: route.polyline.encodedPolyline,
          },
          bounds: {
            northeast: {
              lat: route.viewport.high.latitude,
              lng: route.viewport.high.longitude,
            },
            southwest: {
              lat: route.viewport.low.latitude,
              lng: route.viewport.low.longitude,
            },
          },
          distance: {
            text: `${Math.round(route.distanceMeters / 100) / 10} km`,
            value: route.distanceMeters,
          },
          duration: {
            text: `${Math.round(
              parseInt(route.duration.replace('s', '')) / 60,
            )} mins`,
            value: parseInt(route.duration.replace('s', '')),
          },
          steps: processedSteps,
        },
      });

      // Send initial navigation data
      socket.emit('navigationStarted', {
        navigationId,
        route: {
          overview_polyline: {
            points: route.polyline.encodedPolyline,
          },
          bounds: {
            northeast: {
              lat: route.viewport.high.latitude,
              lng: route.viewport.high.longitude,
            },
            southwest: {
              lat: route.viewport.low.latitude,
              lng: route.viewport.low.longitude,
            },
          },
          distance: {
            text: `${Math.round(route.distanceMeters / 100) / 10} km`,
            value: route.distanceMeters,
          },
          duration: {
            text: `${Math.round(
              parseInt(route.duration.replace('s', '')) / 60,
            )} mins`,
            value: parseInt(route.duration.replace('s', '')),
          },
          steps: processedSteps,
        },
      });
    } catch (error) {
      console.error('Error starting navigation:', error);
      socket.emit('navigationError', {error: 'Failed to start navigation'});
    }
  });

  // Update user position
  socket.on('updatePosition', data => {
    const {lat, lng, heading, speed} = data;
    const session = navigationSessions.get(socket.id);

    console.log('Update position from sockets');

    if (!session) {
      socket.emit('navigationError', {error: 'No active navigation session'});
      return;
    }

    // Update last known position
    session.lastPosition = {lat, lng};

    // Get route steps
    const steps = session.route.legs[0].steps;

    // Find the closest point on the route to the current position
    const {matchedPoint, stepIndex, distanceToRoute} =
      NavigationUtils.findClosestPointOnRoute({lat, lng}, steps);

    // Check if user is off route
    const isOffRoute = distanceToRoute > 30; // 30 meters threshold
    // Update current step index in session
    session.currentStepIndex = stepIndex;

    // Get current and next step
    const currentStep = steps[stepIndex];
    const nextStep = stepIndex < steps.length - 1 ? steps[stepIndex + 1] : null;

    // Calculate distance to next maneuver
    const distanceToNextStep = nextStep
      ? NavigationUtils.calculateDistance(
          lat,
          lng,
          nextStep.startLocation.latLng.latitude,
          nextStep.startLocation.latLng.longitude,
        )
      : 0;

    // Calculate distance to destination
    const distanceToDestination = NavigationUtils.calculateDistance(
      lat,
      lng,
      session.destination.lat,
      session.destination.lng,
    );

    // Estimate time to next step based on current speed
    const userSpeed = speed > 0 ? speed : 1.4; // Default to average walking speed of 1.4 m/s
    const timeToNextStep = Math.round(distanceToNextStep / userSpeed);
    const timeToDestination = Math.round(distanceToDestination / userSpeed);

    // Generate voice instruction
    let voiceInstruction = '';
    if (nextStep) {
      // Calculate bearing to determine maneuver type
      const currentBearing =
        heading ||
        NavigationUtils.calculateBearing(
          lat,
          lng,
          currentStep.endLocation.latLng.latitude,
          currentStep.endLocation.latLng.longitude,
        );

      const nextBearing = NavigationUtils.calculateBearing(
        nextStep.startLocation.latLng.latitude,
        nextStep.startLocation.latLng.longitude,
        nextStep.endLocation.latLng.latitude,
        nextStep.endLocation.latLng.longitude,
      );

      const maneuverType =
        nextStep.navigationInstruction?.maneuver ||
        NavigationUtils.getManeuverType(currentBearing, nextBearing);

      voiceInstruction = NavigationUtils.generateVoiceInstruction(
        maneuverType,
        nextStep.navigationInstruction?.instructions || '',
        distanceToNextStep,
      );
    }

    // Prepare navigation update
    const navigationUpdate = {
      currentStepIndex: stepIndex,
      currentStep: {
        instructions: currentStep.navigationInstruction?.instructions || '',
        distance: {
          text: `${Math.round(currentStep.distanceMeters / 100) / 10} km`,
          value: currentStep.distanceMeters,
        },
        duration: {
          text: `${Math.round(
            parseInt(currentStep.staticDuration.replace('s', '')) / 60,
          )} mins`,
          value: parseInt(currentStep.staticDuration.replace('s', '')),
        },
      },
      nextManeuver: nextStep
        ? {
            type: nextStep.navigationInstruction?.maneuver || 'straight',
            instruction: nextStep.navigationInstruction?.instructions || '',
          }
        : null,
      distanceToNextStep,
      timeToNextStep,
      distanceToDestination,
      timeToDestination,
      isOnRoute: !isOffRoute,
      recalculationNeeded: isOffRoute,
      voiceInstruction,
    };

    console.log(navigationUpdate);

    // Send update to client
    socket.emit('navigationUpdate', navigationUpdate);

    // Check if destination reached
    if (distanceToDestination < 20) {
      // 20 meters threshold
      socket.emit('destinationReached');
      navigationSessions.delete(socket.id);
    }

    // Check if route recalculation is needed
    if (isOffRoute) {
      recalculateRoute(socket, session);
    }
  });

  // Recalculate route when user is off route
  async function recalculateRoute(socket, session) {
    try {
      const {lastPosition, destination} = session;

      // Prepare request data for Routes API
      const requestData = {
        origin: {
          location: {
            latLng: {
              latitude: lastPosition.lat,
              longitude: lastPosition.lng,
            },
          },
        },
        destination: {
          location: {
            latLng: {
              latitude: destination.lat,
              longitude: destination.lng,
            },
          },
        },
        travelMode: 'WALK',
        polylineQuality: 'OVERVIEW',
      };

      const routeData = await googleMapsService.calculateRouteWithRoutesAPI(
        requestData,
      );

      if (!routeData.routes || routeData.routes.length === 0) {
        socket.emit('navigationError', {error: 'Failed to recalculate route'});
        return;
      }

      // Update session with new route
      session.route = routeData.routes[0];
      session.currentStepIndex = 0;

      // Process route steps for client
      const processedSteps = session.route.legs[0].steps.map(step => ({
        instructions: step.navigationInstruction?.instructions || '',
        distance: {
          text: `${Math.round(step.distanceMeters / 100) / 10} km`,
          value: step.distanceMeters,
        },
        duration: {
          text: `${Math.round(
            parseInt(step.staticDuration.replace('s', '')) / 60,
          )} mins`,
          value: parseInt(step.staticDuration.replace('s', '')),
        },
        startLocation: {
          lat: step.startLocation.latLng.latitude,
          lng: step.startLocation.latLng.longitude,
        },
        endLocation: {
          lat: step.endLocation.latLng.latitude,
          lng: step.endLocation.latLng.longitude,
        },
        maneuver: step.navigationInstruction?.maneuver || '',
        polyline: {
          points: step.polyline.encodedPolyline,
        },
      }));

      // Send updated route to client
      socket.emit('routeRecalculated', {
        route: {
          overview_polyline: {
            points: session.route.polyline.encodedPolyline,
          },
          bounds: {
            northeast: {
              lat: session.route.viewport.high.latitude,
              lng: session.route.viewport.high.longitude,
            },
            southwest: {
              lat: session.route.viewport.low.latitude,
              lng: session.route.viewport.low.longitude,
            },
          },
          distance: {
            text: `${Math.round(session.route.distanceMeters / 100) / 10} km`,
            value: session.route.distanceMeters,
          },
          duration: {
            text: `${Math.round(
              parseInt(session.route.duration.replace('s', '')) / 60,
            )} mins`,
            value: parseInt(session.route.duration.replace('s', '')),
          },
          steps: processedSteps,
        },
      });

      console.log("Recalculated data", {
        route: {
          overview_polyline: {
            points: session.route.polyline.encodedPolyline,
          },
          bounds: {
            northeast: {
              lat: session.route.viewport.high.latitude,
              lng: session.route.viewport.high.longitude,
            },
            southwest: {
              lat: session.route.viewport.low.latitude,
              lng: session.route.viewport.low.longitude,
            },
          },
          distance: {
            text: `${Math.round(session.route.distanceMeters / 100) / 10} km`,
            value: session.route.distanceMeters,
          },
          duration: {
            text: `${Math.round(
              parseInt(session.route.duration.replace('s', '')) / 60,
            )} mins`,
            value: parseInt(session.route.duration.replace('s', '')),
          },
          steps: processedSteps,
        },
      });
    } catch (error) {
      console.error('Error recalculating route:', error);
      socket.emit('navigationError', {error: 'Failed to recalculate route'});
    }
  }

  // End navigation
  socket.on('endNavigation', () => {
    navigationSessions.delete(socket.id);
    console.log('Navigation ended');
    socket.emit('navigationEnded');
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    navigationSessions.delete(socket.id);
    console.log('Client disconnected:', socket.id);
  });
};
