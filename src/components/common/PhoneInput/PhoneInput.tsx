import React from 'react';
import { View } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import { Typography } from '../Typography';
import { styles } from './PhoneInput.styles';

export interface PhoneInputProps {
  label?: string;
  value?: string;
  onChangeText: (phone: string) => void;
  onChangeCountryCode: (code: string) => void;
  countryCode: string;
  error?: string;
}

export const PhoneInputComponent: React.FC<PhoneInputProps> = ({
  label,
  value,
  onChangeText,
  onChangeCountryCode,
  countryCode,
  error,
}) => {
  return (
    <View style={styles.container}>
      {label && (
        <Typography variant="body2" style={styles.label}>
          {label}
        </Typography>
      )}
      <PhoneInput
        defaultCode="US"
        defaultValue={value}
        onChangeText={(text: string) => {
          // Store only digits so validation (10 digits) works and input stays editable
          const digitsOnly = text.replace(/\D/g, '');
          onChangeText(digitsOnly);
        }}
        onChangeCountry={(country: any) => {
          if (
            country &&
            Array.isArray(country.callingCode) &&
            country.callingCode.length > 0
          ) {
            onChangeCountryCode(`+${country.callingCode[0]}`);
          }
        }}
        containerStyle={styles.phoneContainer}
        textContainerStyle={styles.textContainer}
        textInputStyle={styles.textInput}
        codeTextStyle={styles.codeText}
      />
      {error && (
        <Typography variant="caption" style={styles.errorText}>
          {error}
        </Typography>
      )}
    </View>
  );
};

