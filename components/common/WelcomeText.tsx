import React from 'react';
import {Text, StyleSheet} from 'react-native';

export const WelcomeText: React.FC = () => {
  return <Text style={styles.text}>Welcome Back</Text>;
};

const styles = StyleSheet.create({
  text: {
    color: '#1E293B',
    fontSize: 30,
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    textAlign: 'center',
    alignSelf: 'center',
  },
});
