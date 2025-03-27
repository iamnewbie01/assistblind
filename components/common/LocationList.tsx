import React from 'react';
import {View, StyleSheet} from 'react-native';
import {LocationCard} from '../Card/LocationCard2';

export const LocationList: React.FC = () => {
  const locations = [
    {
      title: 'Location X',
      address: 'Address -hhhhhhhhh',
      distance: 'Distance: 0 kms',
    },
    {
      title: 'Location Y',
      address: 'Address -hhhhhhhhh',
      distance: 'Distance: 0 kms',
    },
    {
      title: 'Location Z',
      address: 'Address -hhhhhhhhh',
      distance: 'Distance: 0 kms',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        {locations.map((location, index) => (
          <LocationCard
            key={index}
            title={location.title}
            address={location.address}
            distance={location.distance}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 25,
    display: 'flex',
    justifyContent: 'center',
    minHeight: 441,
  },
  listContainer: {
    borderRadius: 12,
    padding: 15,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    width: '100%',
  },
});
