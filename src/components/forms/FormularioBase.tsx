import React, { ReactNode } from 'react';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';

interface FormularioBaseProps<T> {
  valoresIniciais: T;
  onSubmit: (values: T, helpers: FormikHelpers<T>) => void | Promise<void>;
  children: (props: FormikProps<T>) => ReactNode;
  validacao?: any;
  titulo?: string;
}

export function FormularioBase<T>({
  valoresIniciais,
  onSubmit,
  children,
  validacao,
  titulo,
}: FormularioBaseProps<T>) {
  return (
    <Formik
      initialValues={valoresIniciais}
      onSubmit={onSubmit}
      validationSchema={validacao}
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