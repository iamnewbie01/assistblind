import * as React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {BackIcon} from '../icons/BackIcon';

interface BackButtonProps {
  onPress: () => void;
  activeOpacity: number;
  accessible: boolean;
  accessibilityLabel: string;
  accessibilityHint: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  activeOpacity,
  accessible,
  accessibilityLabel,
  accessibilityHint,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={activeOpacity}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}>
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
