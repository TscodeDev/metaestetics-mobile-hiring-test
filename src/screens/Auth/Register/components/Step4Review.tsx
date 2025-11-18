import React from 'react';
import { View } from 'react-native';
import { RegisterData } from '@types';
import { Button, Card, Typography } from '@components/common';
import { formatDate, formatPhoneNumber } from '@utils/formatters';

export interface Step4ReviewProps {
  formData: RegisterData;
  onPrevious: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  error?: string;
}

export const Step4Review: React.FC<Step4ReviewProps> = ({
  formData,
  onPrevious,
  onSubmit,
  isLoading,
  error,
}) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    countryCode,
    dateOfBirth,
    gender,
  } = formData;

  return (
    <View style={{ paddingTop: 16, marginTop: 8 }}>
      <Typography variant="h2" style={{ marginBottom: 8 }}>
        Review your details
      </Typography>
      <Typography variant="body2" style={{ marginBottom: 24 }}>
        Please confirm that everything looks correct before creating your account.
      </Typography>

      <Card style={{ marginBottom: 24 }}>
        <Typography variant="h4" style={{ marginBottom: 12 }}>
          Account
        </Typography>
        <Typography variant="body2" style={{ marginBottom: 4 }}>
          Email
        </Typography>
        <Typography variant="body1" style={{ marginBottom: 12 }}>
          {email}
        </Typography>

        <Typography variant="h4" style={{ marginBottom: 12 }}>
          Personal info
        </Typography>

        <Typography variant="body2" style={{ marginBottom: 4 }}>
          Name
        </Typography>
        <Typography variant="body1" style={{ marginBottom: 12 }}>
          {firstName} {lastName}
        </Typography>

        <Typography variant="body2" style={{ marginBottom: 4 }}>
          Phone
        </Typography>
        <Typography variant="body1" style={{ marginBottom: 12 }}>
          {formatPhoneNumber(phoneNumber, countryCode)}
        </Typography>

        <Typography variant="body2" style={{ marginBottom: 4 }}>
          Date of birth
        </Typography>
        <Typography variant="body1" style={{ marginBottom: 12 }}>
          {formatDate(dateOfBirth)}
        </Typography>

        <Typography variant="body2" style={{ marginBottom: 4 }}>
          Gender
        </Typography>
        <Typography variant="body1">
          {gender.charAt(0).toUpperCase() + gender.slice(1)}
        </Typography>
      </Card>

      {error && (
        <Typography
          variant="caption"
          style={{ color: 'red', marginBottom: 12, textAlign: 'center' }}
        >
          {error}
        </Typography>
      )}

      <View style={{ flexDirection: 'row', marginTop: 24, gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Button
            title="Back"
            onPress={onPrevious}
            variant="outline"
            size="large"
            fullWidth
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            title="Create account"
            onPress={onSubmit}
            variant="primary"
            size="large"
            fullWidth
            loading={isLoading}
          />
        </View>
      </View>
    </View>
  );
};

