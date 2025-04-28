import React from 'react';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Input } from '@chakra-ui/react';

export function DatePicker(props: ReactDatePickerProps) {
  return (
    <ReactDatePicker
      customInput={<Input />}
      dateFormat="dd/MM/yyyy"
      locale="pt-BR"
      {...props}
    />
  );
} 