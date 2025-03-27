class NavigationUtils {
  // Calculate distance between two points using Haversine formula
  static calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  // Calculate bearing between two points
  static calculateBearing(lat1, lng1, lat2, lng2) {
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const λ1 = (lng1 * Math.PI) / 180;
    const λ2 = (lng2 * Math.PI) / 180;

    const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
    const x =
      Math.cos(φ1) * Math.sin(φ2) -
      Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);

    const θ = Math.atan2(y, x);
    return ((θ * 180) / Math.PI + 360) % 360; // in degrees
  }

  // Decode Google's encoded polyline format
  static decodePolyline(encoded) {
    console.log(encoded);
    const points = [];
    let index = 0,
      lat = 0,
      lng = 0;

    while (index < encoded.length) {
      let b,
        shift = 0,
        result = 0;

      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;

      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({
        lat: lat / 1e5,
        lng: lng / 1e5,
      });
    }

    return points;
  }

  // Find closest point on route to current position
  static findClosestPointOnRoute(position, steps) {
    let closestDistance = Infinity;
    let closestPoint = null;
    let matchedStepIndex = 0;

    steps.forEach((step, stepIndex) => {
      // Decode polyline to get path points
      console.log(step);
      const pathPoints = this.decodePolyline(step.polyline.encodedPolyline);

      // Find closest point in this step
      pathPoints.forEach(point => {
        const distance = this.calculateDistance(
          position.lat,
          position.lng,
          point.lat,
          point.lng,
        );

        if (distance < closestDistance) {
          closestDistance = distance;
          closestPoint = point;
          matchedStepIndex = stepIndex;
        }
      });
    });

    return {
      matchedPoint: closestPoint,
      stepIndex: matchedStepIndex,
      distanceToRoute: closestDistance,
    };
  }

  // Get maneuver type based on bearing change
  static getManeuverType(currentBearing, nextBearing) {
    const bearingDiff = (nextBearing - currentBearing + 360) % 360;

    if (bearingDiff < 20 || bearingDiff > 340) return 'straight';
    if (bearingDiff >= 20 && bearingDiff < 60) return 'slight-right';
    if (bearingDiff >= 60 && bearingDiff < 120) return 'right';
    if (bearingDiff >= 120 && bearingDiff < 150) return 'sharp-right';
    if (bearingDiff >= 150 && bearingDiff < 210) return 'u-turn';
    if (bearingDiff >= 210 && bearingDiff < 240) return 'sharp-left';
    if (bearingDiff >= 240 && bearingDiff < 300) return 'left';
    if (bearingDiff >= 300 && bearingDiff < 340) return 'slight-left';

    return 'unknown';
  }

  // Extract street name from HTML instructions
  static extractStreetName(instruction) {
    // Remove HTML tags
    const plainText = instruction.replace(/<[^>]*>/g, '');

    // Common patterns for street names
    const patterns = [
      /onto ([^,]+)/,
      /on ([^,]+)/,
      /toward ([^,]+)/,
      /destination will be on ([^,]+)/,
    ];

    for (const pattern of patterns) {
      const match = plainText.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return '';
  }

  // Generate voice instructions based on maneuver
  static generateVoiceInstruction(maneuver, instruction, distance) {
    const streetName = this.extractStreetName(instruction);
    const distanceText =
      distance < 50 ? 'Now' : `In ${Math.round(distance)} meters`;

    switch (maneuver) {
      case 'straight':
        return `${distanceText}, continue straight${
          streetName ? ' on ' + streetName : ''
        }`;
      case 'slight-right':
        return `${distanceText}, slight right${
          streetName ? ' onto ' + streetName : ''
        }`;
      case 'right':
        return `${distanceText}, turn right${
          streetName ? ' onto ' + streetName : ''
        }`;
      case 'sharp-right':
        return `${distanceText}, sharp right${
          streetName ? ' onto ' + streetName : ''
        }`;
      case 'u-turn':
        return `${distanceText}, make a U-turn${
          streetName ? ' onto ' + streetName : ''
        }`;
      case 'sharp-left':
        return `${distanceText}, sharp left${
          streetName ? ' onto ' + streetName : ''
        }`;
      case 'left':
        return `${distanceText}, turn left${
          streetName ? ' onto ' + streetName : ''
        }`;
      case 'slight-left':
        return `${distanceText}, slight left${
          streetName ? ' onto ' + streetName : ''
        }`;
      default:
        return `${distanceText}, continue${
          streetName ? ' on ' + streetName : ''
        }`;
    }
  }
}

module.exports = NavigationUtils;
