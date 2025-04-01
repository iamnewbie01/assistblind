import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import OutdoorNavigationScreen1 from './screens/navigation/OutdoorNavigationScreen1';
import OutdoorNavigationScreen2 from './screens/navigation/OutdoorNavigationScreen2';
import OutdoorNavigationScreen3 from './screens/navigation/OutdoorNavigationScreen3';
import OutdoorNavigationScreen4 from './screens/navigation/OutdoorNavigationScreen4';
import IndoorNavigation from './screens/navigation/IndoorNavigationScreen';
import ProfileScreen from './screens/profile/ProfileScreen';
import ProfileEditor from './screens/profile/EditProfileScreen';
import MainMenuScreen from './screens/main/MainMenuScreen';
import LoginScreen from './screens/auth/LoginScreen';
import RegistrationScreen from './screens/auth/RegistrationScreen';
import SplashScreen from './screens/auth/SplashScreen';
import {Place} from './types/types';
import {ApolloProvider} from '@apollo/client';
import client from './api/apollo';
import {UserProfile} from './api/queries/profile';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs();

// Define the navigation stack types
export type RootStackParamList = {
  OutdoorNavigationScreen1: undefined;
  OutdoorNavigationScreen2: {
    locations: Place[];
    userLocation: {
      latitude: number;
      longitude: number;
    };
  };
  OutdoorNavigationScreen3: {locationDetails: Place};
  OutdoorNavigationScreen4: {
    locationDetails: Place;
    userLocation: {
      latitude: number;
      longitude: number;
    };
  };
  IndoorNavigation: undefined;
  ProfileScreen: undefined;
  ProfileEditor: {user: UserProfile};
  MainMenuScreen: undefined;
  LoginScreen: undefined;
  RegistrationScreen: undefined;
  SplashScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  console.log('App is running..');
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SplashScreen">
          <Stack.Screen
            name="OutdoorNavigationScreen1"
            component={OutdoorNavigationScreen1}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="OutdoorNavigationScreen2"
            component={OutdoorNavigationScreen2}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="OutdoorNavigationScreen3"
            component={OutdoorNavigationScreen3}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="OutdoorNavigationScreen4"
            component={OutdoorNavigationScreen4}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="IndoorNavigation"
            component={IndoorNavigation}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ProfileScreen"
            component={ProfileScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ProfileEditor"
            component={ProfileEditor}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MainMenuScreen"
            component={MainMenuScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="RegistrationScreen"
            component={RegistrationScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}
