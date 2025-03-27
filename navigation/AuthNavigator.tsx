// import React from 'react';
// import {createStackNavigator} from '@react-navigation/stack';
// import {RouteProp, useRoute} from '@react-navigation/native';

// import LoginScreen from '../screens/auth/LoginScreen';
// import {RegistrationScreen} from '../screens/auth/RegistrationScreen';
// import * as NavigationService from './NavigationService';

// // Define param list for Auth stack
// type AuthStackParamList = {
//   Login: {onBiometricLogin: () => void};
//   Register: {onRegistrationComplete: () => void};
// };

// // Define the route param type to get params from parent navigator
// type AuthRouteProp = RouteProp<{
//   params: {
//     initialRouteName: string;
//     onAuthenticate: () => void;
//   };
// }>;

// const Stack = createStackNavigator<AuthStackParamList>();

// const AuthNavigator: React.FC = () => {
//   // Get params passed from AppNavigator
//   const route = useRoute<AuthRouteProp>();
//   const {initialRouteName = 'Login', onAuthenticate} = route.params || {};

//   // Handler for biometric login
//   const handleBiometricLogin = () => {
//     onAuthenticate();
//     NavigationService.reset('Main');
//   };

//   // Handler for registration completion
//   const handleRegistrationComplete = () => {
//     onAuthenticate();
//     NavigationService.reset('Main');
//   };

//   return (
//     <Stack.Navigator
//       initialRouteName={initialRouteName as keyof AuthStackParamList}
//       screenOptions={{headerShown: false}}>
//       <Stack.Screen
//         name="Login"
//         component={LoginScreen}
//         initialParams={{
//           onBiometricLogin: handleBiometricLogin,
//         }}
//       />
//       <Stack.Screen
//         name="Register"
//         component={RegistrationScreen}
//         initialParams={{
//           onRegistrationComplete: handleRegistrationComplete,
//         }}
//       />
//     </Stack.Navigator>
//   );
// };

// export default AuthNavigator;
