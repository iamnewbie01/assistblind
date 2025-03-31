import * as React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {PhoneIcon} from '../icons/PhoneIcon';

interface ContentCardProps {
  onPause: () => void;
  onEnd: () => void;
  nextInstruction: string;
  destination: string;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  onPause,
  onEnd,
  nextInstruction,
  destination,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.routeInfo}>
          <Text style={styles.routeTitle}>{destination}</Text>
        </View>
      </View>

      <View style={styles.navigationInfo}>
        <Text style={styles.nextTurn}>Next: {nextInstruction}</Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.pauseButton}
          onPress={onPause}
          accessible={true}
          accessibilityLabel="Repeat"
          accessibilityHint="To repeat the recent navigation instruction">
          <Text style={styles.pauseButtonText}>Repeat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.endButton}
          onPress={onEnd}
          accessible={true}
          accessibilityLabel="End"
          accessibilityHint="To end the navigation">
          <Text style={styles.endButtonText}>End</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 5,
    backgroundColor: 'white',
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routeInfo: {
    gap: 2,
  },
  routeTitle: {
    color: '#000',
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '700',
  },
  routeSubtitle: {
    color: '#64748B',
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '400',
  },
  phoneButton: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigationInfo: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#F1F5F9',
    gap: 4,
  },
  nextTurn: {
    color: '#000',
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '400',
  },
  cautionText: {
    color: '#475569',
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '400',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  pauseButton: {
    flex: 1,
    backgroundColor: '#4F46E5',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  pauseButtonText: {
    color: '#FFF',
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '700',
  },
  endButton: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  endButtonText: {
    color: '#1E293B',
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '700',
  },
});
