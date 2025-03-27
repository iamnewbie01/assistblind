import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {EyeIcon} from '../icons/EyeIcon';

export const ContentContainer = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <EyeIcon />
      </View>
      <Text style={styles.title}>Assist Blind</Text>
      <Text style={styles.subtitle}>AI-Powered Navigation Assistant</Text>
      <Text style={styles.tapText}>Tap anywhere to continue</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    width: 265,
    top: '50%',
    transform: [{translateY: -150}],
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 68,
    height: 60,
    marginBottom: 16,
  },
  title: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 36,
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    marginBottom: 18,
  },
  subtitle: {
    color: '#C7D2FE',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginBottom: 32,
  },
  tapText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    opacity: 0.86,
  },
});
