import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface ProfileFieldProps {
  label: string;
  value: string;
}

export const ProfileField: React.FC<ProfileFieldProps> = ({label, value}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
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
  value: {
    color: '#ADAEBC',
    fontSize: 18,
    fontWeight: '400',
    padding: 8,
  },
});
