import { useId } from 'react';

interface UseAccessibilityProps {
  id?: string;
  label?: string;
  error?: string;
  helperText?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  name?: string;
  placeholder?: string;
}

interface UseAccessibilityResult {
  fieldId: string;
  labelId: string;
  helperId: string;
  errorId: string;
  getAriaProps: () => {
    'aria-labelledby': string | undefined;
    'aria-describedby': string | undefined;
    'aria-invalid': boolean;
    'aria-required': boolean;
    'aria-disabled': boolean;
    'aria-busy': boolean;
    title: string | undefined;
  };
}

export function useAccessibility({
  id,
  label,
  error,
  helperText,
  isRequired,
  isDisabled,
  isLoading,
  name,
  placeholder
}: UseAccessibilityProps): UseAccessibilityResult {
  const uniqueId = useId();
  const fieldId = id || `field-${uniqueId}`;
  const labelId = `${fieldId}-label`;
  const helperId = `${fieldId}-helper`;
  const errorId = `${fieldId}-error`;

  const getAriaProps = () => {
    const describedByIds = [];
    if (helperText) describedByIds.push(helperId);
    if (error) describedByIds.push(errorId);

    const accessibleName = label || name || placeholder;

    return {
      'aria-labelledby': label ? labelId : undefined,
      'aria-describedby': describedByIds.length > 0 ? describedByIds.join(' ') : undefined,
      'aria-invalid': !!error,
      'aria-required': !!isRequired,
      'aria-disabled': !!isDisabled,
      'aria-busy': !!isLoading,
      title: accessibleName
    };
  };

  return {
    fieldId,
    labelId,
    helperId,
    errorId,
    getAriaProps
  };
} 