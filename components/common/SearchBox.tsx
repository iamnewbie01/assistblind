import * as React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {LocationIcon} from '../icons/LocationIcon';

// Define interface for component props
interface SearchBoxProps {
  onPress: () => void;
  accessible: boolean;
  accessibilityLabel: string;
  accessibilityHint: string;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  onPress,
  accessible,
  accessibilityLabel,
  accessibilityHint,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}>
      <View style={styles.locationIconWrapper}>
        <LocationIcon />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Search Here</Text>
        <Text style={styles.subtitle}>Voice recognition of search</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 17,
    alignItems: 'center',
    marginTop: 33,
    width: '100%',
    maxWidth: '100%',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  locationIconWrapper: {
    padding: 10,
    alignItems: 'center',
  },
  content: {
    flexDirection: 'column',
    marginLeft: 5,
  },
  title: {
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 18,
    color: '#000000',
    lineHeight: 18,
  },
  subtitle: {
    fontFamily: 'Poppins',
    fontWeight: '400',
    fontSize: 14,
    color: '#64748B',
    lineHeight: 14,
    marginTop: 10,
  },
});
