import React from 'react';
import { View } from 'react-native';
import { RegisterData } from '@types';
import { Button, Typography, ImagePickerComponent } from '@components/common';

export interface Step3ProfilePhotoProps {
  formData: Partial<RegisterData>;
  onDataChange: (data: Partial<RegisterData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const Step3ProfilePhoto: React.FC<Step3ProfilePhotoProps> = ({
  formData,
  onDataChange,
  onNext,
  onPrevious,
}) => {
  const handleImageSelected = (uri: string) => {
    onDataChange({ profileImage: uri });
  };

  return (
    <View style={{ paddingTop: 16, marginTop: 8 }}>
      <Typography variant="h2" style={{ marginBottom: 8 }}>
        Add a profile photo
      </Typography>
      <Typography variant="body2" style={{ marginBottom: 24 }}>
        This step is optional, you can add or change your photo later.
      </Typography>

      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <ImagePickerComponent
          currentImage={formData.profileImage}
          onImageSelected={handleImageSelected}
          size={140}
        />
      </View>

      <View style={{ flexDirection: 'row', marginTop: 8, gap: 12 }}>
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
            onPress={onNext}
            variant="primary"
            size="large"
            fullWidth
          />
        </View>
      </View>
    </View>
  );
};

