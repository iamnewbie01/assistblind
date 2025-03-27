import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

interface ButtonProps {
  onPress: () => void;
}

export const RegisterButton: React.FC<ButtonProps> = ({onPress}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>Register New Account</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    borderColor: '#CBD5E1',
    borderWidth: 2,
    marginTop: 24,
    marginBottom: -49,
    paddingHorizontal: 1,
    paddingVertical: 23,
    alignItems: 'center'
  },
  text: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#334155',
    textAlign: 'center',
  },
});
