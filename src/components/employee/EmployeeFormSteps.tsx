'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppNotifications } from '@/hooks/useAppNotifications';
import { EmployeeService } from '@/services/employeeService';
import { DadosEmpregado } from '@/types/esocial';
import {
  Box,
  VStack,
  useSteps,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
} from '@chakra-ui/react';
import { DadosPessoaisForm } from '@/components/empregado/DadosPessoaisForm';
import { DadosContratuaisForm } from '@/components/empregado/DadosContratuaisForm';
import { DadosRemuneracaoForm } from '@/components/empregado/DadosRemuneracaoForm';
import { DadosDocumentosForm } from '@/components/empregado/DadosDocumentosForm';
import { DadosEnderecoForm } from '@/components/empregado/DadosEnderecoForm';

interface EmployeeFormStepsProps {
  employeeId: string;
  empregadorId: string;
}

const steps = [
  { title: 'Dados Pessoais', description: 'Informações básicas' },
  { title: 'Documentos', description: 'Documentos necessários' },
  { title: 'Endereço', description: 'Endereço completo' },
  { title: 'Dados Contratuais', description: 'Informações do contrato' },
  { title: 'Remuneração', description: 'Informações salariais' },
];

export function EmployeeFormSteps({ employeeId, empregadorId }: EmployeeFormStepsProps) {
  const router = useRouter();
  const notifications = useAppNotifications();
  const employeeService = new EmployeeService();
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const [formData, setFormData] = useState<Partial<DadosEmpregado>>({
    empregadorId,
    id: employeeId,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployee();
  }, [employeeId]);

  const loadEmployee = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getEmployee(employeeId);
      if (data) {
        setFormData(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      notifications.showError(
        'Erro ao carregar dados',
        'Não foi possível carregar os dados do empregado',
        { persistent: true }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async (data: Partial<DadosEmpregado>) => {
    setFormData(prev => ({ ...prev, ...data }));
    
    if (activeStep === steps.length - 1) {
      try {
        const finalData = { ...formData, ...data };
        await employeeService.updateEmployee(employeeId, finalData as DadosEmpregado);
        notifications.showSuccess('Dados atualizados com sucesso!');
        router.push('/empregados');
      } catch (error) {
        notifications.showError(
          'Erro ao atualizar',
          'Não foi possível atualizar os dados do empregado',
          { persistent: true }
        );
      }
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSaveDraft = async () => {
    try {
      await employeeService.updateEmployee(employeeId, formData as DadosEmpregado);
      notifications.showSuccess('Alterações salvas com sucesso!');
      router.push('/empregados');
    } catch (error) {
      notifications.showError(
        'Erro ao salvar',
        'Não foi possível salvar as alterações',
        { persistent: true }
      );
    }
  };

  if (loading) {
    return <Box>Carregando...</Box>;
  }

  return (
    <Box>
      <VStack spacing={8} align="stretch">
        <Stepper index={activeStep}>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>

              <Box flexShrink="0">
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </Box>

              <StepSeparator />
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <DadosPessoaisForm
            initialData={formData}
            onSubmit={handleNext}
            onBack={handleBack}
            onSaveDraft={handleSaveDraft}
          />
        )}

        {activeStep === 1 && (
          <DadosDocumentosForm
            initialData={formData}
            onSubmit={handleNext}
            onBack={handleBack}
            onSaveDraft={handleSaveDraft}
          />
        )}

        {activeStep === 2 && (
          <DadosEnderecoForm
            initialData={formData}
            onSubmit={handleNext}
            onBack={handleBack}
            onSaveDraft={handleSaveDraft}
          />
        )}

        {activeStep === 3 && (
          <DadosContratuaisForm
            initialData={formData}
            onSubmit={handleNext}
            onBack={handleBack}
            onSaveDraft={handleSaveDraft}
          />
        )}

        {activeStep === 4 && (
          <DadosRemuneracaoForm
            initialData={formData}
            onSubmit={handleNext}
            onBack={handleBack}
            onSaveDraft={handleSaveDraft}
          />
        )}
      </VStack>
    </Box>
  );
} 