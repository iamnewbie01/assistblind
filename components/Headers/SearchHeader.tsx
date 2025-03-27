import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {BackButton} from '../Buttons/BackButton';
import {SearchBox} from '../common/SearchBox';

export const SearchHeader = () => {
  const handleBackPress = () => {
    // Handle back navigation
    console.log('Back pressed');
  };
  const handleSearch = () => {

  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <BackButton onPress={handleBackPress} />
          <SearchBox onPress={handleSearch}/>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#0F172A',
  },
  content: {
    width: '100%',
    padding: 16,
  },
  searchContainer: {
    padding: 24,
    position: 'relative',
  },
});
