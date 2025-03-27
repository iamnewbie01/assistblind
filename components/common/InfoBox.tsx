import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface InfoBoxProps {
  mainText: string;
  details: string[];
}

export const InfoBox: React.FC<InfoBoxProps> = ({mainText, details}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>{mainText}</Text>
      <View style={styles.details}>
        {details.map((detail, index) => (
          <Text key={index} style={styles.detailText}>
            {detail}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#F1F5F9',
  },
  mainText: {
    color: '#000',
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },
  detailText: {
    color: '#475569',
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '400',
  },
});
