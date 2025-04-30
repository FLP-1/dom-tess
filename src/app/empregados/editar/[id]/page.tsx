'use client';

import { Box, Heading } from '@chakra-ui/react';
import { useAuth } from '@/contexts/AuthContext';
import { EmployeeFormSteps } from '@/components/employee/EmployeeFormSteps';
import { useParams } from 'next/navigation';

export default function EditarEmpregadoPage() {
  const { user } = useAuth();
  const params = useParams();
  const employeeId = params.id as string;

  if (!user) {
    return null;
  }

  return (
    <Box>
      <Heading size="lg" mb={6}>
        Editar Cadastro de Empregado
      </Heading>
      <EmployeeFormSteps 
        employeeId={employeeId}
        empregadorId={user.uid}
      />
    </Box>
  );
} 