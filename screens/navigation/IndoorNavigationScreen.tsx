import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {NavigationCard} from '../../components/Card/NavigationCard';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import ObstacleDetectionApp from "../../services/ObstacleDetection";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'IndoorNavigation'>;
};

const IndoorNavigation: React.FC<Props> = ({navigation}) => {
  const handleEndNavigation = () => {
    // Handle navigation end
    console.log('Navigation ended');
    navigation.navigate('MainMenuScreen');
  };

  return (
    <View style={styles.container}>
      <ObstacleDetectionApp />
      <View style={styles.overlay}>
        {/* <NavigationCard onEndNavigation={handleEndNavigation} /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: '#0F172A',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    padding: 24,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default IndoorNavigation;
