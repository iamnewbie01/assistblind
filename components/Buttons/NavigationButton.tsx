import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

interface NavigationButtonProps {
  onPress: () => void;
  title: string;
}

export const NavigationButton: React.FC<NavigationButtonProps> = ({
  onPress,
  title,
}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4F46E5',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
});
