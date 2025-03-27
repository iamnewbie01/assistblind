import React from 'react';
import {View, StyleSheet} from 'react-native';
import {BackButton} from '../Buttons/BackButton';
import {SearchBox} from './SearchBox';
import {LocationCard} from '../Card/LocationCard';

const Container = () => {
  const handleBackPress = () => {
    // Handle back navigation
  };

  const handleSearchPress = () => {
    // Handle serach
  };

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
      <BackButton onPress={handleBackPress} />
      <SearchBox onPress={handleSearchPress}/>
      <View style={styles.locationsContainer}>
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
    width: '100%',
    position: 'relative',
    backgroundColor: '#0F172A',
    flex: 1,
  },
  locationsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 25,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
});

export default Container;
