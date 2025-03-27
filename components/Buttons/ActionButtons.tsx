import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {ButtonProps} from '../../types/types';

interface ActionButtonsProps {
  onBack: () => void;
  onStart: () => void;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  label,
  variant = 'secondary',
}) => (
  <TouchableOpacity
    style={[
      styles.button,
      variant === 'primary' ? styles.primaryButton : styles.secondaryButton,
    ]}
    onPress={onPress}>
    <Text
      style={[
        styles.buttonText,
        variant === 'primary' ? styles.primaryText : styles.secondaryText,
      ]}>
      {label}
    </Text>
  </TouchableOpacity>
);

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onBack,
  onStart,
}) => {
  return (
    <View style={styles.container}>
      <Button onPress={onBack} label="Back" />
      <Button onPress={onStart} label="Start" variant="primary" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
  },
  buttonText: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#4F46E5',
  },
  secondaryButton: {
    backgroundColor: '#E2E8F0',
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#1E293B',
  },
});
