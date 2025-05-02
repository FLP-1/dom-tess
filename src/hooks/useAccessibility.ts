import { useId, useCallback } from 'react';

interface UseAccessibilityProps {
  id?: string;
  label?: string;
  error?: string;
  helperText?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  role?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

interface UseAccessibilityReturn {
  // IDs para elementos
  inputId: string;
  labelId: string;
  helperId: string;
  errorId: string;
  groupId: string;
  
  // Props ARIA
  ariaProps: {
    role: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean;
    'aria-required'?: boolean;
    'aria-disabled'?: boolean;
    'aria-busy'?: boolean;
    'aria-expanded'?: boolean;
    'aria-haspopup'?: boolean;
    'aria-controls'?: string;
    'aria-owns'?: string;
  };
  
  // Funções de utilidade
  getAriaDescribedby: (additionalIds?: string[]) => string | undefined;
  getAriaLabelledby: (additionalIds?: string[]) => string | undefined;
  
  // Estados
  isFieldInvalid: boolean;
  isFieldRequired: boolean;
  isFieldDisabled: boolean;
  isFieldLoading: boolean;
  
  // Funções de atualização
  setAriaExpanded: (expanded: boolean) => void;
  setAriaHasPopup: (hasPopup: boolean) => void;
  setAriaControls: (controlsId: string) => void;
  setAriaOwns: (ownsId: string) => void;
}

export function useAccessibility({
  id,
  label,
  error,
  helperText,
  isRequired,
  isDisabled,
  isLoading,
  role = 'group',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
}: UseAccessibilityProps): UseAccessibilityReturn {
  // Gera IDs únicos para os elementos
  const generatedId = useId();
  const inputId = id || `field-${generatedId}`;
  const labelId = `${inputId}-label`;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  const groupId = `${inputId}-group`;

  // Estado inicial dos props ARIA
  const ariaProps = {
    role,
    'aria-labelledby': label ? labelId : undefined,
    'aria-describedby': error ? errorId : helperText ? helperId : ariaDescribedby,
    'aria-invalid': !!error,
    'aria-required': isRequired,
    'aria-disabled': isDisabled,
    'aria-busy': isLoading,
  };

  // Função para gerar aria-describedby
  const getAriaDescribedby = useCallback((additionalIds: string[] = []): string | undefined => {
    const ids = [];
    if (error) ids.push(errorId);
    if (helperText && !error) ids.push(helperId);
    if (ariaDescribedby) ids.push(ariaDescribedby);
    ids.push(...additionalIds);
    return ids.length > 0 ? ids.join(' ') : undefined;
  }, [error, helperText, errorId, helperId, ariaDescribedby]);

  // Função para gerar aria-labelledby
  const getAriaLabelledby = useCallback((additionalIds: string[] = []): string | undefined => {
    const ids = [];
    if (label) ids.push(labelId);
    if (ariaLabel) ids.push(`${inputId}-aria-label`);
    ids.push(...additionalIds);
    return ids.length > 0 ? ids.join(' ') : undefined;
  }, [label, ariaLabel, labelId, inputId]);

  // Funções de atualização de estados ARIA
  const setAriaExpanded = useCallback((expanded: boolean) => {
    ariaProps['aria-expanded'] = expanded;
  }, [ariaProps]);

  const setAriaHasPopup = useCallback((hasPopup: boolean) => {
    ariaProps['aria-haspopup'] = hasPopup;
  }, [ariaProps]);

  const setAriaControls = useCallback((controlsId: string) => {
    ariaProps['aria-controls'] = controlsId;
  }, [ariaProps]);

  const setAriaOwns = useCallback((ownsId: string) => {
    ariaProps['aria-owns'] = ownsId;
  }, [ariaProps]);

  return {
    // IDs
    inputId,
    labelId,
    helperId,
    errorId,
    groupId,
    
    // Props ARIA
    ariaProps,
    
    // Funções de utilidade
    getAriaDescribedby,
    getAriaLabelledby,
    
    // Estados
    isFieldInvalid: !!error,
    isFieldRequired: !!isRequired,
    isFieldDisabled: !!isDisabled,
    isFieldLoading: !!isLoading,
    
    // Funções de atualização
    setAriaExpanded,
    setAriaHasPopup,
    setAriaControls,
    setAriaOwns,
  };
} 