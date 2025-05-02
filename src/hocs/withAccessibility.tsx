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
  WrappedComponent: React.ComponentType<P>
) {
  return React.forwardRef<HTMLElement, P>((props, ref) => {
    const {
      label,
      error,
      helperText,
      isRequired,
      isDisabled,
      isLoading,
      id,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedby,
      ...rest
    } = props;

    const {
      inputId,
      labelId,
      helperId,
      errorId,
      ariaProps
    } = useAccessibility({
      id,
      label,
      error,
      helperText,
      isRequired,
      isDisabled,
      isLoading
    });

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
          htmlFor={inputId}
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

    // Função para gerar aria-describedby
    const getAriaDescribedby = () => {
      const ids = [];
      if (error) ids.push(errorId);
      if (helperText && !error) ids.push(helperId);
      if (ariaDescribedby) ids.push(ariaDescribedby);
      return ids.length > 0 ? ids.join(' ') : undefined;
    };

    return (
      <FormControl
        isInvalid={!!error}
        isRequired={isRequired}
        isDisabled={isDisabled}
        width={props.width}
        {...ariaProps}
      >
        {renderLabel()}

        <WrappedComponent
          ref={ref}
          id={inputId}
          {...(rest as P)}
          aria-invalid={!!error}
          aria-required={isRequired}
          aria-disabled={isDisabled}
          aria-busy={isLoading}
          aria-label={ariaLabel}
          aria-describedby={getAriaDescribedby()}
          data-loading={isLoading}
          data-disabled={isDisabled}
          data-invalid={!!error}
          data-required={isRequired}
        />

        {renderFeedback()}
      </FormControl>
    );
  });
} 