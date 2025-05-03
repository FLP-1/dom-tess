import { useState, useCallback, useEffect } from 'react';
import { ValidationRule } from '../utils/validations';
import { logger } from '../utils/logger';

export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
}

export interface UseFormOptions<T> {
  initialValues: T;
  validationRules?: Partial<Record<keyof T, ValidationRule[]>>;
  onSubmit?: (values: T) => Promise<void> | void;
  onReset?: () => void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationRules = {},
  onSubmit,
  onReset,
  validateOnChange = true,
  validateOnBlur = true,
}: UseFormOptions<T>) {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isValid: true,
    isSubmitting: false,
    isDirty: false,
  });

  const validateField = useCallback((field: keyof T, value: any): string | undefined => {
    const rules = validationRules[field];
    if (!rules) return undefined;

    for (const rule of rules) {
      const error = rule(value);
      if (error) return error;
    }

    return undefined;
  }, [validationRules]);

  const validateForm = useCallback((): Partial<Record<keyof T, string>> => {
    const errors: Partial<Record<keyof T, string>> = {};

    Object.keys(validationRules).forEach((field) => {
      const error = validateField(field as keyof T, state.values[field]);
      if (error) {
        errors[field as keyof T] = error;
      }
    });

    return errors;
  }, [validationRules, validateField, state.values]);

  const handleChange = useCallback((field: keyof T, value: any) => {
    setState((prev) => {
      const newValues = { ...prev.values, [field]: value };
      const newErrors = { ...prev.errors };
      const newTouched = { ...prev.touched, [field]: true };
      const isDirty = JSON.stringify(newValues) !== JSON.stringify(initialValues);

      if (validateOnChange) {
        const error = validateField(field, value);
        if (error) {
          newErrors[field] = error;
        } else {
          delete newErrors[field];
        }
      }

      return {
        ...prev,
        values: newValues,
        errors: newErrors,
        touched: newTouched,
        isValid: Object.keys(newErrors).length === 0,
        isDirty,
      };
    });
  }, [validateField, validateOnChange, initialValues]);

  const handleBlur = useCallback((field: keyof T) => {
    setState((prev) => {
      const newTouched = { ...prev.touched, [field]: true };
      
      if (validateOnBlur) {
        const error = validateField(field, prev.values[field]);
        const newErrors = { ...prev.errors };
        
        if (error) {
          newErrors[field] = error;
        } else {
          delete newErrors[field];
        }

        return {
          ...prev,
          errors: newErrors,
          touched: newTouched,
          isValid: Object.keys(newErrors).length === 0,
        };
      }

      return {
        ...prev,
        touched: newTouched,
      };
    });
  }, [validateField, validateOnBlur]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    setState((prev) => ({ ...prev, isSubmitting: true }));

    try {
      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
        setState((prev) => ({
          ...prev,
          errors,
          isValid: false,
          isSubmitting: false,
        }));
        return;
      }

      if (onSubmit) {
        await onSubmit(state.values);
      }
    } catch (error) {
      logger.error('Erro ao submeter formulário:', error);
      setState((prev) => ({
        ...prev,
        errors: {
          ...prev.errors,
          submit: error instanceof Error ? error.message : 'Erro ao processar formulário',
        },
      }));
    } finally {
      setState((prev) => ({ ...prev, isSubmitting: false }));
    }
  }, [onSubmit, state.values, validateForm]);

  const handleReset = useCallback(() => {
    setState({
      values: initialValues,
      errors: {},
      touched: {},
      isValid: true,
      isSubmitting: false,
      isDirty: false,
    });

    if (onReset) {
      onReset();
    }
  }, [initialValues, onReset]);

  const setFieldValue = useCallback((field: keyof T, value: any) => {
    handleChange(field, value);
  }, [handleChange]);

  const setFieldError = useCallback((field: keyof T, error: string | undefined) => {
    setState((prev) => {
      const newErrors = { ...prev.errors };
      
      if (error) {
        newErrors[field] = error;
      } else {
        delete newErrors[field];
      }

      return {
        ...prev,
        errors: newErrors,
        isValid: Object.keys(newErrors).length === 0,
      };
    });
  }, []);

  const setFieldTouched = useCallback((field: keyof T, touched = true) => {
    setState((prev) => ({
      ...prev,
      touched: { ...prev.touched, [field]: touched },
    }));
  }, []);

  return {
    ...state,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    validateField,
    validateForm,
  };
} 