import React, {useState} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {ProfileHeader} from '../../components/Headers/ProfileHeader';
import {ProfileForm} from '../../components/Form/ProfileForms';
import {ActionButtons} from '../../components/Buttons/EditActionButtons';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {ScrollView} from 'react-native-gesture-handler';
import {BackButton} from '../../components/Buttons/BackButton';
import {RouteProp} from '@react-navigation/native';
import {useMutation} from '@apollo/client';
import {GET_USER_PROFILE, UPDATE_USER_PROFILE} from '../../api/queries/profile';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'ProfileEditor'>;
  route: RouteProp<RootStackParamList, 'ProfileEditor'>;
};

const ProfileEditor: React.FC<Props> = ({route, navigation}) => {
  const {user} = route.params;

  const [formData, setFormData] = useState({
    name: user?.name || '',
    contactNumber: user?.contactNumber || '',
    emergencyName: user?.emergencyName || '',
    emergencyContact: user?.emergencyContact || '',
  });

  const [updateUserProfile, {loading}] = useMutation(UPDATE_USER_PROFILE, {
    onCompleted: () => {
      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    },
    onError: error => {
      Alert.alert('Error', error.message);
    },
    refetchQueries: [{query: GET_USER_PROFILE}],
  });

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleCancel = () => {
    // Handle cancel action
    navigation.navigate('MainMenuScreen');
  };

  const handleSave = () => {
    // Handle save action
    if (
      !formData.name ||
      !formData.contactNumber ||
      !formData.emergencyName ||
      !formData.emergencyContact
    ) {
      Alert.alert('Validation Error', 'All fields are required');
      return;
    }

    updateUserProfile({
      variables: {
        input: {
          name: formData.name,
          contactNumber: formData.contactNumber,
          emergencyName: formData.emergencyName,
          emergencyContact: formData.emergencyContact,
        },
      },
    });
    // back to profile screen
    navigation.navigate('MainMenuScreen');
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton
            onPress={() => {
              navigation.navigate('ProfileScreen');
            }}
          />
        </View>
        <View style={styles.content}>
          <View style={styles.innerContent}>
            <ProfileHeader />
            <View style={styles.formContainer}>
              <ProfileForm onChangeText={handleChange}/>
              <ActionButtons onCancel={handleCancel} onSave={handleSave} />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   marginHorizontal: 'auto',
  //   maxWidth: 480,
  //   width: '100%',
  // },
  container: {
    padding: 24,
    fontFamily: 'Poppins',
    marginHorizontal: 'auto',
    maxWidth: 480,
    width: '100%',
  },
  header: {
    // height: 1,
    display: 'flex',
    alignItems: 'center',
    // marginBottom: 1,
  },
  content: {
    width: '100%',
    paddingHorizontal: 1,
    paddingTop: 1,
    paddingBottom: 1,
  },
  innerContent: {
    paddingBottom: 13,
  },
  formContainer: {
    zIndex: 10,
    display: 'flex',
    width: '100%',
    paddingBottom: 31,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
});

export default ProfileEditor;
