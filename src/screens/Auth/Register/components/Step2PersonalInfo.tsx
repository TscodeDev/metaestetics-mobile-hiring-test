import React, { useState } from 'react';
import { View } from 'react-native';
import { Formik } from 'formik';
import { RegisterData } from '@types';
import { Input, Button, Typography, DatePicker, SelectInput } from '@components/common';
import { registerStep2ValidationSchema } from '@utils/validation';

export interface Step2PersonalInfoProps {
  formData: Partial<RegisterData>;
  onDataChange: (data: Partial<RegisterData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

interface Step2FormValues {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  countryCode: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | '';
}

export const Step2PersonalInfo: React.FC<Step2PersonalInfoProps> = ({
  formData,
  onDataChange,
  onNext,
  onPrevious,
}) => {
  const [dobDate, setDobDate] = useState<Date | null>(
    formData.dateOfBirth ? new Date(formData.dateOfBirth) : null
  );

  const initialValues: Step2FormValues = {
    firstName: formData.firstName ?? '',
    lastName: formData.lastName ?? '',
    phoneNumber: formData.phoneNumber ?? '',
    countryCode: formData.countryCode ?? '+1',
    dateOfBirth: formData.dateOfBirth ?? '',
    gender: (formData.gender as Step2FormValues['gender']) ?? '',
  };

  const handleSubmit = (values: Step2FormValues) => {
    const { gender, ...rest } = values;
    const normalizedGender = gender === '' ? undefined : gender;
    onDataChange({ ...rest, gender: normalizedGender as RegisterData['gender'] | undefined });
    onNext();
  };

  return (
    <View style={{ paddingTop: 16, marginTop: 8 }}>
      <Typography variant="h2" style={{ marginBottom: 8 }}>
        Personal information
      </Typography>
      <Typography variant="body2" style={{ marginBottom: 24 }}>
        Tell us a bit more about yourself.
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={registerStep2ValidationSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit: submit,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <View>
            <Input
              label="First name"
              placeholder="Enter your first name"
              value={values.firstName}
              onChangeText={handleChange('firstName')}
              onBlur={handleBlur('firstName')}
              error={touched.firstName && errors.firstName ? errors.firstName : undefined}
            />

            <Input
              label="Last name"
              placeholder="Enter your last name"
              value={values.lastName}
              onChangeText={handleChange('lastName')}
              onBlur={handleBlur('lastName')}
              error={touched.lastName && errors.lastName ? errors.lastName : undefined}
            />

            <View style={{ marginBottom: 12, paddingBottom: 4 }}>
              <SelectInput
                label="Country code"
                value={values.countryCode}
                onChange={value => setFieldValue('countryCode', value)}
                options={[
                  { label: '+1 (US)', value: '+1' },
                  { label: '+44 (UK)', value: '+44' },
                  { label: '+61 (AU)', value: '+61' },
                  { label: '+91 (IN)', value: '+91' },
                ]}
                placeholder="Select country code"
              />
            </View>

            <Input
              label="Phone number"
              placeholder="Enter your phone number"
              value={values.phoneNumber}
              onChangeText={text => setFieldValue('phoneNumber', text.replace(/\D/g, ''))}
              onBlur={handleBlur('phoneNumber')}
              error={touched.phoneNumber && errors.phoneNumber ? errors.phoneNumber : undefined}
              keyboardType="phone-pad"
            />

            <DatePicker
              label="Date of birth"
              value={dobDate}
              onChange={date => {
                setDobDate(date);
                setFieldValue('dateOfBirth', date.toISOString());
              }}
              error={touched.dateOfBirth && errors.dateOfBirth ? errors.dateOfBirth : undefined}
            />

            <SelectInput
              label="Gender"
              value={values.gender}
              onChange={value => setFieldValue('gender', value)}
              options={[
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' },
                { label: 'Other', value: 'other' },
              ]}
              error={touched.gender && errors.gender ? errors.gender : undefined}
              placeholder="Select gender"
            />

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
                  title="Next"
                  onPress={submit as any}
                  variant="primary"
                  size="large"
                  fullWidth
                />
              </View>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};
