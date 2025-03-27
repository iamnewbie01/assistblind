import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface NavigationHeaderProps {
  title: string;
  subtitle: string;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  title,
  subtitle,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  title: {
    color: '#000',
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    color: '#64748B',
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '400',
  },
});
