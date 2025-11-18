import React, { useMemo, useEffect, useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import { Image } from 'expo-image';
import {
  Input,
  Button,
  Typography,
  DatePicker,
  SelectInput,
  ImagePickerComponent,
} from '@components/common';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { updateProfileThunk } from '@store/auth/authThunks';
import { clearError } from '@store/auth/authSlice';
import { MainStackParamList } from '@types';
import { editProfileValidationSchema } from '@utils/validation';
import { styles } from './EditProfile.styles';

type EditProfileScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'EditProfile'>;

interface EditProfileFormValues {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  countryCode: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | '';
  profileImage?: string;
}

export const EditProfile: React.FC = () => {
  const navigation = useNavigation<EditProfileScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector(state => state.auth);
  const [dobDate, setDobDate] = useState<Date | null>(
    user?.dateOfBirth ? new Date(user.dateOfBirth) : null
  );

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const initialValues: EditProfileFormValues | null = useMemo(() => {
    if (!user) return null;

    return {
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      countryCode: user.countryCode,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      profileImage: user.profileImage,
    };
  }, [user]);

  if (!user || !initialValues) {
    return null;
  }

  const handleSubmit = async (values: EditProfileFormValues) => {
    const { gender, ...rest } = values;
    const normalizedGender = gender === '' ? undefined : gender;

    const updates = {
      ...rest,
      gender: normalizedGender ?? user.gender,
    };

    const result = await dispatch(
      updateProfileThunk({
        userId: user.id,
        updates,
      })
    );

    if (updateProfileThunk.fulfilled.match(result)) {
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Typography variant="h3" style={styles.formSectionTitle}>
          Edit Profile
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={editProfileValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
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
              <View style={styles.header}>
                <ImagePickerComponent
                  currentImage={values.profileImage}
                  onImageSelected={uri => setFieldValue('profileImage', uri)}
                  size={120}
                />
              </View>

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
                placeholder="Select gender"
                error={touched.gender && errors.gender ? errors.gender : undefined}
              />

              {error && (
                <Typography variant="caption" style={styles.errorText}>
                  {error}
                </Typography>
              )}

              <View style={styles.buttonsRow}>
                <View style={styles.button}>
                  <Button
                    title="Cancel"
                    onPress={() => navigation.goBack()}
                    variant="outline"
                    size="large"
                    fullWidth
                    disabled={isLoading}
                  />
                </View>
                <View style={styles.button}>
                  <Button
                    title="Save"
                    onPress={submit as any}
                    variant="primary"
                    size="large"
                    fullWidth
                    loading={isLoading}
                  />
                </View>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

