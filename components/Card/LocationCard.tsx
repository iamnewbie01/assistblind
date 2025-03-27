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
      <View style={styles.inner}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.details}>
          <Text style={styles.address}>{address}</Text>
          <Text style={styles.distance}>{distance}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 15,
  },
  inner: {
    borderRadius: 12,
    padding: 24,
    backgroundColor: '#F1F5F9',
  },
  title: {
    color: '#000',
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
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
