import React , { useEffect } from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {NavigationCard} from '../../components/Card/NavigationCard';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import ObstacleDetectionApp from './ObstacleDetection.tsx';
import {BackButton} from '../../components/Buttons/BackButton.tsx';
import { BackHandler } from 'react-native';

type Props = {
  navigation: StackNavigationProp<RootStackParamList>;
};

const IndoorNavigation: React.FC<Props> = ({navigation}) => {

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleEndNavigation();
      return true;
    });

    return () => backHandler.remove();
  }, [navigation]);

  const handleEndNavigation = () => {
    console.log('Navigation ended');
    navigation.navigate('MainMenuScreen');
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.backButtonContainer}>
        <BackButton
          onPress={handleEndNavigation}
          activeOpacity={0.9}
          accessible={true}
          accessibilityLabel="Tap to go back"
          accessibilityHint="Tap to go back"
        />
      </View> */}
      <View style={styles.obstacleDetectionContainer}>
        <ObstacleDetectionApp outdoor={0} />
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
  backButtonContainer: {
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  obstacleDetectionContainer: {
    flex: 1,
    height: '90%',
    width: '100%',
  },
});

export default IndoorNavigation;
