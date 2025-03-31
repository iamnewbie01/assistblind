import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  AccessibilityInfo,
} from 'react-native';
import {BackButton} from '../../components/Buttons/BackButton';
import {ProfileField} from '../../components/common/ProfileField';
import {BiometricSection} from '../../components/common/BiometricSection';
import {EditButton} from '../../components/Buttons/EditButton';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {ScrollView} from 'react-native-gesture-handler';
import {useQuery} from '@apollo/client';
import {GET_USER_PROFILE} from '../../api/queries/profile';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'ProfileScreen'>;
};

const ProfileScreen: React.FC<Props> = ({navigation}) => {
  const {loading, error, data} = useQuery(GET_USER_PROFILE);
  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    Alert.alert('An internal error occured, please try again later!');
    AccessibilityInfo.announceForAccessibility(
      'An internal error occured while loading your profile, please try again later!!',
    );
    navigation.goBack();
  }

  const user = data.getUserProfile;
  const handleBackPress = () => {
    // Handle navigation back
    console.log('Back pressed');
    navigation.navigate('MainMenuScreen');
  };

  const handleEditPress = () => {
    // Handle edit profile
    console.log('Edit profile pressed');
    navigation.navigate('ProfileEditor', {user});
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton
            onPress={handleBackPress}
            activeOpacity={0.9}
            accessible={true}
            accessibilityLabel="Tap to go back"
            accessibilityHint="Tap to go back"
          />
        </View>

        <View>
          <Text style={styles.title}>Profile</Text>

          <View style={styles.formFields}>
            <ProfileField label="Full Name" value={user.name} />
            <ProfileField label="Phone Number" value={user.contactNumber} />
            <ProfileField
              label="Name of Emergency Contact"
              value={user.emergencyName}
            />
            <ProfileField
              label="Emergency Contact"
              value={user.emergencyContact}
            />
          </View>

          <BiometricSection />

          <EditButton onPress={handleEditPress} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    fontFamily: 'Poppins',
    marginHorizontal: 'auto',
    maxWidth: 480,
    width: '100%',
  },
  header: {
    height: 20,
    display: 'flex',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#1E293B',
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 10,
  },
  formFields: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
});

export default ProfileScreen;
