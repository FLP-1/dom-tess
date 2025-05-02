import React, { forwardRef } from 'react';
import {
  Box,
  Button,
  ButtonProps,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useForm } from '../../hooks/useForm';
import { ValidationRule } from '../../utils/validations';
import { SelectField } from '../common/SelectField';
import { AutocompleteInput, AutocompleteOption } from '../common/AutocompleteInput';
import { MaskedInput } from '../common/MaskedInput';

export interface FormField {
  name: string;
  label?: string;
  type?: 'text' | 'number' | 'email' | 'password' | 'tel' | 'date' | 'select' | 'autocomplete';
  mask?: 'cpf' | 'cnpj' | 'phone' | 'date' | 'currency' | 'percentage' | 'zipcode' | 'time' | 'creditcard' | 'numbers' | 'letters' | 'lettersAndNumbers' | 'removeAccents' | 'uppercase' | 'lowercase' | 'capitalize';
  validationRules?: ValidationRule<string>[];
  helperText?: string;
  options?: Array<{ value: string | number; label: string; group?: string }>;
  minCharsToSearch?: number;
  isRequired?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  width?: string | number;
}

export interface FormContainerProps {
  title?: string;
  description?: string;
  fields: FormField[];
  initialValues: Record<string, any>;
  onSubmit: (values: Record<string, any>) => Promise<void> | void;
  onReset?: () => void;
  submitLabel?: string;
  resetLabel?: string;
  submitButtonProps?: ButtonProps;
  resetButtonProps?: ButtonProps;
  spacing?: number;
  width?: string | number;
  maxWidth?: string | number;
}

export const FormContainer = forwardRef<HTMLFormElement, FormContainerProps>(
  (
    {
      title,
      description,
      fields,
      initialValues,
      onSubmit,
      onReset,
      submitLabel = 'Enviar',
      resetLabel = 'Limpar',
      submitButtonProps,
      resetButtonProps,
      spacing = 4,
      width = '100%',
      maxWidth = '600px',
    },
    ref
  ) => {
    const toast = useToast();
    const {
      values,
      errors,
      touched,
      isValid,
      isSubmitting,
      isDirty,
      handleChange,
      handleBlur,
      handleSubmit,
      handleReset,
      setFieldValue,
      setFieldError,
      setFieldTouched,
    } = useForm({
      initialValues,
      onSubmit: async (values) => {
        try {
          await onSubmit(values);
          toast({
            title: 'Sucesso',
            description: 'Formulário enviado com sucesso',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
        } catch (error) {
          toast({
            title: 'Erro',
            description: error instanceof Error ? error.message : 'Erro ao enviar formulário',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      },
      onReset,
    });

    return (
      <Box
        as="form"
        ref={ref}
        onSubmit={handleSubmit}
        onReset={handleReset}
        width={width}
        maxWidth={maxWidth}
        mx="auto"
        role="form"
        aria-labelledby={title ? 'form-title' : undefined}
        aria-describedby={description ? 'form-description' : undefined}
      >
        <VStack spacing={spacing} align="stretch">
          {title && (
            <Heading as="h2" size="lg" id="form-title">
              {title}
            </Heading>
          )}
          {description && (
            <Text id="form-description" color="gray.600">
              {description}
            </Text>
          )}
          {fields.map((field) => {
            const error = errors[field.name];
            const isTouched = touched[field.name];
            const value = values[field.name];

            return (
              <FormControl
                key={field.name}
                isInvalid={!!error && isTouched}
                isRequired={field.isRequired}
                isDisabled={field.isDisabled || field.isLoading}
                width={field.width}
              >
                {field.label && <FormLabel htmlFor={field.name}>{field.label}</FormLabel>}
                {field.type === 'select' ? (
                  <SelectField
                    id={field.name}
                    name={field.name}
                    value={value}
                    options={field.options || []}
                    onChange={(value: string) => setFieldValue(field.name, value)}
                    onBlur={(value: string) => setFieldTouched(field.name, true)}
                    isRequired={field.isRequired}
                    isDisabled={field.isDisabled || field.isLoading}
                    width={field.width}
                  />
                ) : field.type === 'autocomplete' ? (
                  <AutocompleteInput
                    id={field.name}
                    name={field.name}
                    value={value}
                    options={(field.options || []).map(option => ({
                      value: String(option.value),
                      label: option.label
                    }))}
                    mask={field.mask}
                    validationRules={field.validationRules}
                    onChange={(value: string) => setFieldValue(field.name, value)}
                    onBlur={(value: string) => setFieldTouched(field.name, true)}
                    minCharsToSearch={field.minCharsToSearch}
                    isRequired={field.isRequired}
                    isDisabled={field.isDisabled || field.isLoading}
                    width={field.width}
                  />
                ) : (
                  <MaskedInput
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    value={value}
                    mask={field.mask}
                    validationRules={field.validationRules}
                    onChange={(value: string) => setFieldValue(field.name, value)}
                    onBlur={(value: string) => setFieldTouched(field.name, true)}
                    isRequired={field.isRequired}
                    isDisabled={field.isDisabled || field.isLoading}
                    width={field.width}
                  />
                )}
                {error && isTouched && <FormErrorMessage>{error}</FormErrorMessage>}
                {field.helperText && <FormHelperText>{field.helperText}</FormHelperText>}
              </FormControl>
            );
          })}
          <Box display="flex" gap={4} justifyContent="flex-end">
            {onReset && (
              <Button
                type="reset"
                variant="outline"
                isDisabled={!isDirty || isSubmitting}
                {...resetButtonProps}
              >
                {resetLabel}
              </Button>
            )}
            <Button
              type="submit"
              colorScheme="blue"
              isDisabled={!isValid || isSubmitting}
              isLoading={isSubmitting}
              {...submitButtonProps}
            >
              {submitLabel}
            </Button>
          </Box>
        </VStack>
      </Box>
    );
  }
); 