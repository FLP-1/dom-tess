import React from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Tooltip,
  Icon,
  useDisclosure,
  VisuallyHidden,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { useAccessibility } from '../hooks/useAccessibility';
import { BaseFieldProps } from '../types/common';

export function withAccessibility<P extends BaseFieldProps>(
  WrappedComponent: React.ComponentType<P & { ref?: React.Ref<any> }>
) {
  const WithAccessibility = React.forwardRef<HTMLElement, P>((props, ref) => {
    const {
      label,
      error,
      helperText,
      isRequired,
      isDisabled,
      isLoading,
      id,
      name,
      placeholder,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedby,
      ...rest
    } = props;

    const uniqueId = React.useId();
    const fieldId = id || uniqueId;
    const labelId = `${fieldId}-label`;
    const helperId = `${fieldId}-helper`;
    const errorId = `${fieldId}-error`;

    // Função para gerar aria-describedby
    const getAriaDescribedby = () => {
      const ids = [];
      if (error) ids.push(errorId);
      if (helperText && !error) ids.push(helperId);
      if (ariaDescribedby) ids.push(ariaDescribedby);
      return ids.length > 0 ? ids.join(' ') : undefined;
    };

    // Estado para controle do tooltip de ajuda
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Função para renderizar o ícone de ajuda
    const renderHelpIcon = () => {
      if (!helperText) return null;

      return (
        <Tooltip
          label={helperText}
          isOpen={isOpen}
          onClose={onClose}
          placement="top"
          hasArrow
        >
          <Icon
            as={InfoIcon}
            ml={2}
            color="gray.500"
            cursor="help"
            onMouseEnter={onOpen}
            onMouseLeave={onClose}
            onFocus={onOpen}
            onBlur={onClose}
            aria-label="Informação adicional"
          />
        </Tooltip>
      );
    };

    // Função para renderizar o indicador de campo obrigatório
    const renderRequiredIndicator = () => {
      if (!isRequired) return null;

      return (
        <>
          <Box as="span" color="red.500" ml={1} aria-hidden="true">
            *
          </Box>
          <VisuallyHidden>obrigatório</VisuallyHidden>
        </>
      );
    };

    // Função para renderizar o label do campo
    const renderLabel = () => {
      if (!label && !ariaLabel) return null;

      return (
        <FormLabel
          id={labelId}
          htmlFor={fieldId}
          mb={1}
          display="flex"
          alignItems="center"
        >
          {label || <VisuallyHidden>{ariaLabel}</VisuallyHidden>}
          {renderRequiredIndicator()}
          {renderHelpIcon()}
        </FormLabel>
      );
    };

    // Função para renderizar mensagens de feedback
    const renderFeedback = () => {
      return (
        <>
          {error && (
            <FormErrorMessage
              id={errorId}
              role="alert"
              aria-live="polite"
            >
              {error}
            </FormErrorMessage>
          )}
          {helperText && !error && (
            <FormHelperText
              id={helperId}
              color={isDisabled ? 'gray.400' : 'gray.500'}
            >
              {helperText}
            </FormHelperText>
          )}
        </>
      );
    };

    const accessibilityProps = {
      id: fieldId,
      'aria-invalid': !!error,
      'aria-required': isRequired,
      'aria-disabled': isDisabled,
      'aria-busy': isLoading,
      'aria-labelledby': label ? labelId : undefined,
      'aria-describedby': getAriaDescribedby(),
      'aria-label': !label && (ariaLabel || placeholder || name) ? (ariaLabel || placeholder || name) : undefined,
      title: label || ariaLabel || placeholder || name || 'Campo de formulário'
    };

    return (
      <FormControl
        isInvalid={!!error}
        isRequired={isRequired}
        isDisabled={isDisabled}
        width={props.width}
      >
        {renderLabel()}

        <WrappedComponent
          ref={ref}
          {...(rest as P)}
          {...accessibilityProps}
          data-loading={isLoading}
          data-disabled={isDisabled}
          data-invalid={!!error}
          data-required={isRequired}
        />

        {renderFeedback()}
      </FormControl>
    );
  });

  WithAccessibility.displayName = `withAccessibility(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return WithAccessibility;
} 