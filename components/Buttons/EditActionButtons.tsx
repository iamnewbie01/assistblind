import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

interface ActionButtonsProps {
  onCancel: () => void;
  onSave: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onCancel,
  onSave,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.saveButton} onPress={onSave}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    marginTop: 16,
    width: '100%',
    flexDirection: 'row',
    gap: 16,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 17,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  saveButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 17,
    alignItems: 'center',
    backgroundColor: '#1E293B',
  },
  cancelText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(30, 41, 59, 1)',
  },
  saveText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 1)',
  },
});
