import * as React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {BackIcon} from '../icons/BackIcon';

interface BackButtonProps {
  onPress: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({onPress}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}>
      <BackIcon />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    left: 30,
    width: 21,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
