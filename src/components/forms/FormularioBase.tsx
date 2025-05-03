import React, { ReactNode } from 'react';
import { Formik, FormikHelpers, FormikProps, FormikValues, Form } from 'formik';
import { FormProps } from '@/types/form';
import { Schema } from 'yup';

export interface FormularioBaseProps<T extends FormikValues> {
  initialValues: T;
  onSubmit: (values: T, helpers: FormikHelpers<T>) => void | Promise<void>;
  validationSchema?: Schema<T>;
  children: (formikProps: FormikProps<T>) => React.ReactNode;
  titulo?: string;
}

export function FormularioBase<T extends FormikValues>({
  initialValues,
  onSubmit,
  validationSchema,
  children,
  titulo,
}: FormularioBaseProps<T>) {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      enableReinitialize
    >
      {(formikProps) => (
        <Form className="space-y-4">
          {titulo && <h2 className="text-2xl font-bold mb-6">{titulo}</h2>}
          {children(formikProps)}
        </Form>
      )}
    </Formik>
  );
} 