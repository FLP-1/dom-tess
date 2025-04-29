'use client';

import React from 'react';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { Box, Button, CircularProgress, Paper, Typography } from '@mui/material';

interface FormularioBaseProps<T> {
  titulo: string;
  valoresIniciais: T;
  validacao: (values: T) => Record<string, string>;
  onSubmit: (values: T, helpers: FormikHelpers<T>) => Promise<void>;
  children: (props: FormikProps<T>) => React.ReactNode;
  botaoSubmit?: string;
  desabilitarSubmit?: boolean;
}

export function FormularioBase<T>({
  titulo,
  valoresIniciais,
  validacao,
  onSubmit,
  children,
  botaoSubmit = 'Salvar',
  desabilitarSubmit = false
}: FormularioBaseProps<T>) {
  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        {titulo}
      </Typography>
      
      <Formik
        initialValues={valoresIniciais}
        validate={validacao}
        onSubmit={onSubmit}
      >
        {(formikProps) => (
          <form onSubmit={formikProps.handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {children(formikProps)}
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={desabilitarSubmit || formikProps.isSubmitting}
                  startIcon={formikProps.isSubmitting ? <CircularProgress size={20} /> : null}
                >
                  {botaoSubmit}
                </Button>
              </Box>
            </Box>
          </form>
        )}
      </Formik>
    </Paper>
  );
} 