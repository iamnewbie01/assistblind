import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {FormField} from './FormField';
import {BiometricSection} from '../common/BiometricSection';

interface Props {
  onChangeText: (field: string, text: string) => void;
  formData: {
    name: string;
    contactNumber: string;
    emergencyName: string;
    emergencyContact: string;
  };
}

export const ProfileForm: React.FC<Props> = ({onChangeText, formData}) => {
  return (
    <View style={styles.container}>
      <View style={styles.formFields}>
        <FormField
          label="Full Name"
          value={formData.name}
          field="name"
          onChangeText={onChangeText}
        />
        <FormField
          label="Phone Number"
          value={formData.contactNumber}
          field="contactNumber"
          onChangeText={onChangeText}
        />
        <FormField
          label="Name of Emergency Contact"
          value={formData.emergencyName}
          field="emergencyName"
          onChangeText={onChangeText}
        />
        <FormField
          label="Emergency Contact"
          value={formData.emergencyContact}
          field="emergencyContact"
          onChangeText={onChangeText}
        />
      </View>
      <BiometricSection />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  formFields: {
    marginTop: 1,
  },
  biometricSection: {
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  biometricTextContainer: {
    paddingHorizontal: 48,
    paddingBottom: 12,
  },
  biometricText: {
    fontSize: 16,
    color: 'rgba(51, 65, 85, 1)',
    textAlign: 'center',
  },
});
