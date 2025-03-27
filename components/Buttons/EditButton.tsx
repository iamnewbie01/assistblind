import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

interface EditButtonProps {
  onPress: () => void;
}

export const EditButton: React.FC<EditButtonProps> = ({onPress}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>Edit Profile</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4F46E5',
    padding: 17,
    borderRadius: 12,
    marginTop: 16,
  },
  text: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
