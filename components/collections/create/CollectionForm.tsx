import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Box } from '@/components/ui/box';
import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

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
    <Box className="px-4 py-6">
      <Controller
        control={control}
        name="title"
        render={({ field }) => (
          <FormControl isRequired className="mb-4">
            <FormControlLabel>
              <FormControlLabelText className="mb-2">Collection Title</FormControlLabelText>
            </FormControlLabel>
            <Input
              variant="outline"
              size="md"
              isRequired
              isInvalid={!!errors.title}
              isDisabled={!canEdit}
            >
              <InputField
                placeholder="Enter collection title"
                value={field.value}
                onChangeText={field.onChange}
                selectTextOnFocus
                editable={canEdit}
              />
            </Input>
            {errors.title?.message && (
              <Text className="text-error-500 text-sm mt-1">{errors.title.message}</Text>
            )}
          </FormControl>
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <FormControl className="mb-6">
            <FormControlLabel>
              <FormControlLabelText className="mb-2">Description</FormControlLabelText>
            </FormControlLabel>
            <Textarea size="md" className="min-h-[100px]" isDisabled={!canEdit}>
              <TextareaInput
                placeholder="Enter description (optional)"
                value={field.value || ''}
                onChangeText={field.onChange}
                selectTextOnFocus
                editable={canEdit}
                multiline
                numberOfLines={4}
                className="text-typography-900"
                placeholderTextColor="#a1a1aa"
              />
            </Textarea>
          </FormControl>
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
    </Box>
  );
};