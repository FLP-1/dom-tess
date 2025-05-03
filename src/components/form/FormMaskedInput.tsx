import React, { ChangeEvent, forwardRef } from 'react';
import { BaseMaskedInputProps } from '@/types/form';
import { mask } from '@/utils/mask';
import { MaskType } from '@/types/mask';

interface FormMaskedInputProps extends BaseMaskedInputProps {
  type: MaskType;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

export const FormMaskedInput = forwardRef<HTMLInputElement, FormMaskedInputProps>(
  ({ type, value = '', onChange, ...props }, ref) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const masked = mask({ type, value: value || '' });
      e.target.value = masked.masked;
      onChange?.(e);
    };

    const maskedValue = mask({ type, value: value || '' }).masked;

    return (
      <input
        ref={ref}
        type="text"
        value={maskedValue}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

FormMaskedInput.displayName = 'FormMaskedInput'; 