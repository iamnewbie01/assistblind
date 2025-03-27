// import {createRef} from 'react';
// import {NavigationContainerRef, CommonActions} from '@react-navigation/native';

// export const navigationRef = createRef<NavigationContainerRef<any>>();

// export function navigate(name: string, params?: object) {
//   if (navigationRef.current) {
//     navigationRef.current.navigate(name, params);
//   }
// }

// export function reset(routeName: string, params?: object) {
//   if (navigationRef.current) {
//     navigationRef.current.dispatch(
//       CommonActions.reset({
//         index: 0,
//         routes: [{name: routeName, params}],
//       }),
//     );
//   }
// }

// export function goBack() {
//   if (navigationRef.current && navigationRef.current.canGoBack()) {
//     navigationRef.current.goBack();
//   }
// }
