import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {ProfileIcon} from '../icons/ProfileIcon';

interface HeaderProps {
  onPress: () => void;
}

export const Header: React.FC<HeaderProps> = ({onPress}) => {

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Assist Blind</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={onPress}
          accessibilityLabel="Profile"
          accessibilityRole="button"
          accessible={true}
          accessibilityHint="To open the profile page">
          <ProfileIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 72,
    paddingTop: 16,
    paddingRight: 24,
    paddingBottom: 16,
    paddingLeft: 24,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
  },
  logoContainer: {
    justifyContent: 'center',
  },
  logoText: {
    color: '#1e293b',
    fontSize: 20,
    fontWeight: '700',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
  },
});

export default Header;
