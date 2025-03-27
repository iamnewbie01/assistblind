import React from 'react';
import {View, StyleSheet} from 'react-native';
import MainMenuHeader from '../../components/Headers/MainMenuHeader';
import OutdoorNavigationButton from '../../components/Buttons/NavButtonOutdoor';
import IndoorNavigationButton from '../../components/Buttons/NavButtonIndoor';
import RecentRoutes from '../../components/Card/RecentRoutesCard';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'MainMenuScreen'>;
};

const MainMenuScreen: React.FC<Props> = ({navigation}) => {
  const handleProfilePress = () => {
    navigation.navigate('ProfileScreen');
  };
  return (
    <View style={styles.container}>
      <MainMenuHeader onPress={handleProfilePress} />

      <View style={styles.navigationButtons}>
        <OutdoorNavigationButton
          onPress={() => navigation.navigate('OutdoorNavigationScreen1')}
        />
        <IndoorNavigationButton
          onPress={() => navigation.navigate('IndoorNavigation')}
        />
      </View>

      {/* <RecentRoutes /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  navigationButtons: {
    marginLeft: 18,
    flexDirection: 'row',
    marginTop: 20,
    gap: 16, // Provides spacing between buttons
  },
});

export default MainMenuScreen;
