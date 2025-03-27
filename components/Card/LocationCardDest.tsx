import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Place} from '../../types/types';

interface LocationCardProps {
  location: Place;
}

function formatTime(seconds: number): string {
  // Handle negative values
  const isNegative = seconds < 0;
  seconds = Math.abs(seconds);
  
  // Extract whole seconds and milliseconds
  const wholeSeconds = Math.floor(seconds);
  const milliseconds = Math.round((seconds - wholeSeconds) * 1000);
  
  // Calculate hours, minutes, and remaining seconds
  const hours = Math.floor(wholeSeconds / 3600);
  const minutes = Math.floor((wholeSeconds % 3600) / 60);
  const remainingSeconds = wholeSeconds % 60;
  
  // Format with padding
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  
  // Create the base time string
  let timeString = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  
  // Add milliseconds if present
  if (milliseconds > 0) {
    const formattedMs = String(milliseconds).padStart(3, '0');
    timeString += `.${formattedMs}`;
  }
  
  // Add negative sign if needed
  return isNegative ? `-${timeString}` : timeString;
}

function truncateToTwoDecimals(num: number): number {
  const multiplier = Math.pow(10, 2);
  return Math.trunc(num * multiplier) / multiplier;
}


export const LocationCard: React.FC<LocationCardProps> = ({location}) => {
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{location.name}</Text>
        <Text style={styles.detail}>{`${truncateToTwoDecimals(location.distance)} kilometers`}</Text>
        <Text style={styles.detail}>{formatTime(location.distance*1000/1.3)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    backgroundColor: '#F1F5F9',
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  title: {
    color: '#000',
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '500',
  },
  address: {
    color: '#475569',
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 16,
  },
  detail: {
    color: '#475569',
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 16,
  },
});
