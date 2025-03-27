import React from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';

export const ProfileHeader: React.FC = () => {
  return (
    <View>
      <View style={styles.header}>
        <Image
          source={{
            uri: 'https://cdn.builder.io/api/v1/image/assets/f36884f16e574505a2d356830d0b6d0e/2584425d0f2662aedb5bf5b398297d3b77470f2688ee9d6f72c561656797b01c?placeholderIfAbsent=true',
          }}
          style={styles.backIcon}
          resizeMode="contain"
        />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Profile</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    paddingVertical: 16,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  backIcon: {
    width: 21,
    aspectRatio: 0.87,
  },
  titleContainer: {
    zIndex: 10,
  },
  title: {
    color: 'rgba(30, 41, 59, 1)',
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 30,
  },
});
