import React from 'react';
import {View, StyleSheet, AccessibilityInfo} from 'react-native';
import {WelcomeText} from '../../components/common/WelcomeText';
import {FingerprintSection} from '../../components/common/FingerPrintSection';
import {RegisterButton} from '../../components/Buttons/RegisterButton';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {useMutation} from '@apollo/client';
import {LOGIN_WITH_TOUCH_ID} from '../../api/queries/auth';
import {handleBiometricLogin} from '../../services/BiometricService';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'LoginScreen'>;
};

const LoginScreen: React.FC<Props> = ({navigation}) => {
  const [loginWithTouchId, {loading}] = useMutation(LOGIN_WITH_TOUCH_ID);
  const handleLogin = async () => {
    try {
      const success = await handleBiometricLogin(navigation, loginWithTouchId, loading);
      if(success) AccessibilityInfo.announceForAccessibility('Login successful');
    } catch (error) {
      AccessibilityInfo.announceForAccessibility(
        "Login unsuccessful, try again!! If you don't have an account, please register",
      );
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <WelcomeText />
        <FingerprintSection
          onPress={handleLogin}
          activeOpacity={0.9}
          accessible={true}
          accessibilityLabel="Tap to login"
          accessibilityHint="To login the application"
        />
        <View style={styles.divider} />
        <RegisterButton
          onPress={() => navigation.navigate('RegistrationScreen')}
          activeOpacity={0.9}
          accessible={true}
          accessibilityLabel="Tap to register"
          accessibilityHint="If you don't have an account"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: 372,
    marginLeft: 17,
  },
  content: {
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 222,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  divider: {
    height: 5,
    borderRadius: 12,
    marginTop: 24,
  },
});

export default LoginScreen;
