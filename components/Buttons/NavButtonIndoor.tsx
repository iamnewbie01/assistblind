import * as React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {BuildingIcon} from '../icons/BuildingIcon';

interface NavButtonIndoorProps {
  onPress: () => void;
}

const NavButtonIndoor: React.FC<NavButtonIndoorProps> = ({onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      accessible={true}
      accessibilityLabel="Indoor Navigation"
      accessibilityHint="Tap to start indoor navigation">
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          <BuildingIcon />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>Indoor</Text>
          <Text style={styles.text}>Navigation</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 163,
    height: 134,
    borderRadius: 16,
    backgroundColor: '#4f46e5',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 18,
  },
  iconWrapper: {
    height: 43,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -7,
  },
  textContainer: {
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default NavButtonIndoor;
