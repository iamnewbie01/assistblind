import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation } from '@apollo/client';
import { LOGIN_WITH_TOUCH_ID, REGISTER_USER } from '../api/queries/auth';
import { AccessibilityInfo, Alert, BackHandler } from 'react-native';

// Initialize biometrics
const rnBiometrics = new ReactNativeBiometrics();

// Function to handle biometric registration
export const handleBiometricPress = async (formData: any, setFormData: any) => {
  try {
    // Check if biometric authentication is available
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();
    
    if (!available) {
      Alert.alert('Authentication Error', 'Biometric authentication is not available on this device');
      AccessibilityInfo.announceForAccessibility("Biometric authentication is not available on this device, cannot run this app");
      BackHandler.exitApp();
      return;
    }
    
    // Prompt user for fingerprint authentication
    const { success } = await rnBiometrics.simplePrompt({
      promptMessage: 'Scan your fingerprint to register',
      cancelButtonText: 'Cancel'
    });
    
    if (success) {
      // Generate a key pair that will be associated with this user's biometrics
      const { publicKey } = await rnBiometrics.createKeys();
      
      // Update form data with the public key as touchId
      setFormData({
        ...formData,
        touchId: publicKey
      });
      
      // Store the public key for later use
      await AsyncStorage.setItem('publicKey', publicKey);
      
      // Show success message
      AccessibilityInfo.announceForAccessibility('Fingerprint Scan Successful');
      Alert.alert('Success' ,'Fingerprint Scan Successful');
    } else {
      AccessibilityInfo.announceForAccessibility('Fingerprint Scan Unsuccessful, try again');
    }
  } catch (error) {
    console.error('Biometric registration error:', error);
    AccessibilityInfo.announceForAccessibility('Internal error occurred, try again later!!');
    BackHandler.exitApp();
  }
};

// Function to handle biometric login
export const handleBiometricLogin = async (navigation: any, loginWithTouchId: any, loading: any) => {
  try {
    // Check if biometric authentication is available
    const { available } = await rnBiometrics.isSensorAvailable();
    
    if (!available) {
      Alert.alert('Authentication Error', 'Biometric authentication is not available on this device');
      AccessibilityInfo.announceForAccessibility("Biometric authentication is not available on this device, cannot run this app");
      BackHandler.exitApp();
      return;
    }
    
    // Get the stored public key
    const publicKey = await AsyncStorage.getItem('publicKey');
    
    if (!publicKey) {
      AccessibilityInfo.announceForAccessibility("You have not registered yet, please register first");
      return;
    }
    
    // Create a payload to sign
    const payload = `login_request_${Date.now()}`;
    
    // Create a signature using biometric authentication
    const { success, signature } = await rnBiometrics.createSignature({
      promptMessage: 'Sign in with fingerprint',
      payload,
      cancelButtonText: 'Cancel'
    });
    
    if (success) {
      // Send the signature and payload to your server for verification
      const { data } = await loginWithTouchId({
        variables: { 
          signature,
          payload,
          publicKey
        }
      });
      
      // Store the authentication token
      await AsyncStorage.setItem('token', data.loginWithTouchId.token);
      
      // Navigate to home screen
      navigation.navigate('MainMenuScreen');
      return 1;
    } else {
      AccessibilityInfo.announceForAccessibility("Authentication cancelled");
      return 0;
    }
  } catch (error) {
    console.error('Biometric login error:', error);
    AccessibilityInfo.announceForAccessibility("Unexpected error occurred, please try again later!!");
    BackHandler.exitApp();
    return 0;
  }
};
