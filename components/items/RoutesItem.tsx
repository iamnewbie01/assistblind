import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {LocationIcon} from '../icons/LocationIcon';

interface RouteItemProps {
  name: string;
  distance: string;
  duration: string;
}

export const RouteItem: React.FC<RouteItemProps> = ({
  name,
  distance,
  duration,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <LocationIcon />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.routeName}>{name}</Text>
        <Text style={styles.routeInfo}>{`${distance} • ${duration}`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 12,
    borderRadius: 12,
    height: 68,
    backgroundColor: '#f8fafc',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },
  routeName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  routeInfo: {
    fontSize: 14,
    color: '#64748b',
  },
});
