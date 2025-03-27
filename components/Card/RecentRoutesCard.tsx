import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {RouteItem} from '../items/RoutesItem';

export const RecentRoutes: React.FC = () => {
  const routes = [
    {
      name: 'Home to Market',
      distance: '500m',
      duration: '8 mins',
    },
    {
      name: 'Market to Park',
      distance: '1.2km',
      duration: '15 mins',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Routes</Text>
      <View style={styles.routeList}>
        {routes.map((route, index) => (
          <RouteItem
            key={index}
            name={route.name}
            distance={route.distance}
            duration={route.duration}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  routeList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
});

export default RecentRoutes;
