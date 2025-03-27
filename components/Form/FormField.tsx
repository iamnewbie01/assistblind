import React from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';

interface FormFieldProps {
  field: string;
  label: string;
  value: string;
  onChangeText: (field: string, text: string) => void;
}

export const FormField: React.FC<FormFieldProps> = ({field, label, value, onChangeText}) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput style={styles.value} value={value} onChangeText={(text) => onChangeText(field, text)}></TextInput>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 16,
  },
  labelContainer: {
    paddingBottom: 10,
  },
  label: {
    fontSize: 14,
    color: 'rgba(71, 85, 105, 1)',
  },
  inputContainer: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  value: {
    fontSize: 18,
    lineHeight: 36,
    color: 'rgba(67, 68, 71, 1)',
  },
});
