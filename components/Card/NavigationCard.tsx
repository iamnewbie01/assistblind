import React from 'react';
import {View, StyleSheet} from 'react-native';
import {NavigationHeader} from '../Headers/NavigationHeader';
import {InfoBox} from '../common/InfoBox';
import {NavigationButton} from '../Buttons/NavigationButton';

interface NavigationCardProps {
  onEndNavigation: () => void;
}

export const NavigationCard: React.FC<NavigationCardProps> = ({
  onEndNavigation,
}) => {
  return (
    <View style={styles.card}>
      <NavigationHeader
        title="Indoor Navigation"
        subtitle="First Floor, Building A"
      />
      <InfoBox
        mainText="Ahead: Main corridor"
        details={['Detecting: Door on right, water', 'fountain on left']}
      />
      <NavigationButton title="End Navigation" onPress={onEndNavigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 342,
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
});
