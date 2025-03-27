import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface LocationCardProps {
  title: string;
  address: string;
  distance: string;
}

export const LocationCard: React.FC<LocationCardProps> = ({
  title,
  address,
  distance,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.address}>{address}</Text>
      <Text style={styles.distance}>{distance}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    backgroundColor: '#F1F5F9',
  },
  title: {
    color: '#000',
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 2,
  },
  address: {
    color: '#475569',
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 16,
  },
  distance: {
    color: '#475569',
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '400',
  },
});
