import * as React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {CameraIcon} from '../icons/CameraIcon';

interface NavButtonOutdoorProps {
  onPress: () => void;
}

const NavButtonOutdoor: React.FC<NavButtonOutdoorProps> = ({onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      accessible={true}
      accessibilityLabel="Outdoor Navigation"
      accessibilityHint="Tap to start outdoor navigation">
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          <CameraIcon width={30} height={30} color="#FFFFFF" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>Outdoor</Text>
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
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default NavButtonOutdoor;
