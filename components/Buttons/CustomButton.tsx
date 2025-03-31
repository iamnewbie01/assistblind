import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled: boolean;
  activeOpacity: number;
  accessible: boolean;
  accessibilityLabel: string;
  accessibilityHint: string;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  disabled,
  activeOpacity,
  accessible,
  accessibilityLabel,
  accessibilityHint,
}) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={activeOpacity}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    padding: 17,
    width: '100%',
    marginTop: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
