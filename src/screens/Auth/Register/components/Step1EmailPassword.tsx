import React from 'react';
import { View } from 'react-native';
import { Formik } from 'formik';
import { RegisterData } from '@types';
import { Input, Button, Typography } from '@components/common';
import { registerStep1ValidationSchema } from '@utils/validation';

export interface Step1EmailPasswordProps {
  formData: Partial<RegisterData>;
  onDataChange: (data: Partial<RegisterData>) => void;
  onNext: () => void;
}

interface Step1FormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

export const Step1EmailPassword: React.FC<Step1EmailPasswordProps> = ({
  formData,
  onDataChange,
  onNext,
}) => {
  const initialValues: Step1FormValues = {
    email: formData.email ?? '',
    password: formData.password ?? '',
    confirmPassword: formData.confirmPassword ?? '',
  };

  const handleSubmit = (values: Step1FormValues) => {
    onDataChange(values);
    onNext();
  };

  return (
    <View>
      <Typography variant="h2" style={{ marginBottom: 8 }}>
        Create your account
      </Typography>
      <Typography variant="body2" style={{ marginBottom: 24 }}>
        Enter your email and create a secure password.
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={registerStep1ValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit: submit, values, errors, touched }) => (
          <View>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              error={touched.email && errors.email ? errors.email : undefined}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Password"
              placeholder="Create a password"
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              error={touched.password && errors.password ? errors.password : undefined}
              secureTextEntry
            />

            <Input
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={values.confirmPassword}
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              error={
                touched.confirmPassword && errors.confirmPassword
                  ? errors.confirmPassword
                  : undefined
              }
              secureTextEntry
            />

            <Button
              title="Next"
              onPress={submit as any}
              variant="primary"
              size="large"
              fullWidth
              style={{ marginTop: 24 }}
            />
          </View>
        )}
      </Formik>
    </View>
  );
};
