import React from 'react';
import { View, TextInput, Text } from 'react-native';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Box } from '@/components/ui/box';
import { FormControl, FormControlLabelText } from '@/components/ui/form-control';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { Button, ButtonText } from '@/components/ui/button';

interface FormData {
  title: string;
  description?: string;
}

interface CollectionFormProps {
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  onSubmit: () => void;
  isSubmitting: boolean;
  isDirty?: boolean;
  canEdit?: boolean;
  isNewCollection?: boolean;
}

interface InputFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  errorMessage?: string;
  editable?: boolean;
}

interface TextAreaProps {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  editable?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  placeholder,
  value,
  onChangeText,
  errorMessage, 
  editable = true 
}) => (
  <FormControl isRequired className="mb-4">
    <FormControlLabelText className="mb-2">{label}</FormControlLabelText>
    <Box className={`border rounded-lg p-3 ${
      editable 
        ? 'border-outline-300 bg-background-0' 
        : 'border-outline-200 bg-background-50'
    }`}>  
      <TextInput
        editable={editable}
        className="text-base text-typography-900"
        placeholder={placeholder}
        placeholderTextColor="#a1a1aa"
        value={value}
        onChangeText={onChangeText}
      />
    </Box>
    {errorMessage && (
      <Text className="text-error-500 text-sm mt-1">{errorMessage}</Text>
    )}
  </FormControl>
);

const TextArea: React.FC<TextAreaProps> = ({ 
  label, 
  placeholder, 
  value, 
  onChangeText, 
  editable = true 
}) => (
  <FormControl className="mb-6">
    <FormControlLabelText className="mb-2">{label}</FormControlLabelText>
    <Box className={`border rounded-lg p-3 min-h-[100px] ${
      editable 
        ? 'border-outline-300 bg-background-0' 
        : 'border-outline-200 bg-background-50'
    }`}>      
      <Textarea>
        <TextareaInput
          editable={editable}
          multiline
          numberOfLines={4}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor="#a1a1aa"
          className="text-typography-900"
        />
      </Textarea>
    </Box>
  </FormControl>
);

export const CollectionForm: React.FC<CollectionFormProps> = ({
  control,
  errors,
  onSubmit,
  isSubmitting,
  isDirty = true,
  canEdit = true,
  isNewCollection = false,
}) => {
  const getButtonText = () => {
    if (isNewCollection) {
      return 'Create Test Collection';
    }
    return 'Save Collection';
  };

  const shouldShowButton = () => {
    if (isNewCollection) return true;
    return canEdit && isDirty;
  };

  return (
    <View className="px-4 py-6">
      <Controller
        control={control}
        name="title"
        render={({ field }) => (
          <InputField
            label="Collection Title"
            placeholder="Enter collection title"
            value={field.value}
            onChangeText={field.onChange}
            errorMessage={errors.title?.message}
            editable={canEdit}
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <TextArea
            label="Description"
            placeholder="Enter description (optional)"
            value={field.value || ''}
            onChangeText={field.onChange}
            editable={canEdit}
          />
        )}
      />

      {shouldShowButton() && (
        <Button
          variant="solid"
          action="primary"
          onPress={onSubmit}
          isDisabled={isSubmitting || (!isNewCollection && !isDirty)}
          className="mt-2"
        >
          <ButtonText>
            {isSubmitting ? 'Saving...' : getButtonText()}
          </ButtonText>
        </Button>
      )}
    </View>
  );
};