// import React from 'react';
// import {createStackNavigator} from '@react-navigation/stack';

// import MainMenuScreen from '../screens/main/MainMenuScreen';
// import IndoorNavigationScreen from '../screens/navigation/IndoorNavigationScreen';
// import OutdoorNavigationScreen1 from '../screens/navigation/OutdoorNavigationScreen1';
// import OutdoorNavigationScreen2 from '../screens/navigation/OutdoorNavigationScreen2';
// import OutdoorNavigationScreen3 from '../screens/navigation/OutdoorNavigationScreen3';
// import OutdoorNavigationScreen4 from '../screens/navigation/OutdoorNavigationScreen4';
// import * as NavigationService from './NavigationService';

// const Stack = createStackNavigator();

// const MainNavigator: React.FC = () => {
//   // Handler for ending navigation (returns to Main Menu)
//   const handleEndNavigation = () => {
//     NavigationService.reset('MainMenu');
//   };

//   return (
//     <Stack.Navigator
//       initialRouteName="MainMenu"
//       screenOptions={{headerShown: false}}>
//       <Stack.Screen name="MainMenu" component={MainMenuScreen} />

//       {/* Indoor Navigation */}
//       <Stack.Screen
//         name="IndoorNavigation"
//         component={IndoorNavigationScreen}
//         initialParams={{onEndNavigation: handleEndNavigation}}
//       />

//       {/* Outdoor Navigation Flow */}
//       <Stack.Screen
//         name="OutdoorNavigation1"
//         component={OutdoorNavigationScreen1}
//       />
//       <Stack.Screen
//         name="OutdoorNavigation2"
//         component={OutdoorNavigationScreen2}
//       />
//       <Stack.Screen
//         name="OutdoorNavigation3"
//         component={OutdoorNavigationScreen3}
//       />
//       <Stack.Screen
//         name="OutdoorNavigation4"
//         component={OutdoorNavigationScreen4}
//         initialParams={{onEndNavigation: handleEndNavigation}}
//       />
//     </Stack.Navigator>
//   );
// };

// export default MainNavigator;
