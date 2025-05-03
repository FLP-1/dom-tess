import { MaskOptions, MaskResult, MaskType } from '@/types/mask';
import { maskFunctions } from './maskTypes';

export const mask = (options: MaskOptions): MaskResult => {
  const { type, value } = options;
  if (!value) {
    return {
      masked: '',
      unmasked: ''
    };
  }
  const unmasked = value.replace(/\D/g, '');
  const masked = maskFunctions[type](value);

  return {
    masked,
    unmasked
  };
};

export const unmask = (value: string): string => {
  if (!value) return '';
  return value.replace(/\D/g, '');
};

export const format = (value: string, type: MaskType): string => {
  if (!value) return '';
  return maskFunctions[type](value);
}; 