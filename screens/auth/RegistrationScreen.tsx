import React, {useState} from 'react';
import {Text, View, StyleSheet, AccessibilityInfo} from 'react-native';
import {BackButton} from '../../components/Buttons/BackButton';
import {FormInput} from '../../components/common/FormInput';
import {BiometricSection} from '../../components/common/BiometricSectionSetup';
import {CustomButton} from '../../components/Buttons/CustomButton';
import {ScrollView} from 'react-native-gesture-handler';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {useMutation} from '@apollo/client';
import {REGISTER_USER} from '../../api/queries/auth';
import {handleBiometricPress} from '../../services/BiometricService';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'RegistrationScreen'>;
};

const RegistrationScreen: React.FC<Props> = ({navigation}) => {
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    emergencyName: '',
    emergencyContact: '',
    touchId: '',
  });
  const [registerUser, {loading}] = useMutation(REGISTER_USER);

  const handleBackPress = () => {
    // Handle navigation back
    navigation.navigate('LoginScreen');
  };

  const handleBiometricPressCustom = async () => {
    // Handle biometric setup
    try {
      await handleBiometricPress(formData, setFormData);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async () => {
    // Handle form submission
    try {
      if (
        !formData.name ||
        !formData.contactNumber ||
        !formData.emergencyName ||
        !formData.emergencyContact ||
        !formData.touchId
      ) {
        AccessibilityInfo.announceForAccessibility(
          'Please fill in all fields and scan your fingerprint',
        );
        return;
      }

      // Submit registration data to server
      const {data} = await registerUser({
        variables: {input: formData},
      });

      // Store the authentication token
      await AsyncStorage.setItem('token', data.registerUser.token);
      navigation.navigate('LoginScreen');
      AccessibilityInfo.announceForAccessibility('Registration successful');
      // Show success message
    } catch (error) {
      console.log(error);
      AccessibilityInfo.announceForAccessibility(
        'Registration unsuccessful due to internal error, please try again later!',
      );
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <BackButton onPress={handleBackPress} activeOpacity={0.9}
          accessible={true}
          accessibilityLabel="Back"
          accessibilityHint="Tap to go back"/>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Create Account</Text>
        </View>

        <View style={styles.formFields}>
          <FormInput
            label="Full Name"
            placeholder="Enter your name"
            value={formData.name}
            onChangeText={text => setFormData({...formData, name: text})}
          />
          <FormInput
            label="Phone Number"
            placeholder="Enter phone number"
            value={formData.contactNumber}
            onChangeText={text =>
              setFormData({...formData, contactNumber: text})
            }
          />
          <FormInput
            label="Name of Emergency Contact"
            placeholder="Enter emergency contact name"
            value={formData.emergencyName}
            onChangeText={text =>
              setFormData({...formData, emergencyName: text})
            }
          />
          <FormInput
            label="Emergency Contact"
            placeholder="Enter emergency contact"
            value={formData.emergencyContact}
            onChangeText={text =>
              setFormData({...formData, emergencyContact: text})
            }
          />
        </View>

        <BiometricSection
          onPress={handleBiometricPressCustom}
          activeOpacity={0.9}
          accessible={true}
          accessibilityLabel="Biometric scan"
          accessibilityHint="To give Biometric scan"
        />

        <CustomButton
          title="Complete Registration"
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.9}
          accessible={true}
          accessibilityLabel="Complete Registration"
          accessibilityHint="Completes the process"
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    maxWidth: 390,
    fontFamily: 'Poppins',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  titleContainer: {
    marginBottom: 21,
    marginTop: 40,
  },
  title: {
    color: '#1E293B',
    fontSize: 30,
    fontWeight: '700',
  },
  formFields: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
});

export default RegistrationScreen;
