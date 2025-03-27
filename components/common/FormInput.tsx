import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

interface FormInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#ADAEBC"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  label: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '400',
  },
  input: {
    color: '#1E293B',
    fontSize: 18,
    lineHeight: 28,
    paddingHorizontal: 8,
  },
});
