import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { NavigationCard } from '../../components/Card/NavigationCard';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import ObstacleDetectionApp from "./ObstacleDetection.tsx";
import { BackButton } from '../../components/Buttons/BackButton.tsx';

type Props = {
  navigation: StackNavigationProp<RootStackParamList>;
};

const IndoorNavigation: React.FC<Props> = ({ navigation }) => {
  const handleEndNavigation = () => {
    console.log('Navigation ended');
    navigation.navigate('MainMenuScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.obstacleDetectionContainer}>
        <ObstacleDetectionApp outdoor={0}/>
        <BackButton onPress={handleEndNavigation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  navigationCardContainer: {
    height: '40%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  obstacleDetectionContainer: {
    flex: 1,
    width: '100%',
  },
});

export default IndoorNavigation;