import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {GradientBackground} from '../../components/common/GradientBackground';
import {ContentContainer} from '../../components/common/ContentContainer';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'SplashScreen'>;
};

const SplashScreen: React.FC<Props> = ({navigation}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('LoginScreen')}
      activeOpacity={0.9}
      accessible={true}
      accessibilityLabel="Tap anywhere to continue"
      accessibilityHint="Opens the main application screen">
      <GradientBackground />
      <ContentContainer />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default SplashScreen;