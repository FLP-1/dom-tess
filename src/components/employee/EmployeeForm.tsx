import { FormControl, FormLabel } from '@chakra-ui/react';
'use client';

import { useState, useEffect } from 'react';
import { positionService } from '@/services/positionService';
import { Position } from '@/services/positionService';
import { cctService } from '@/services/cctService';
import { CCT } from '@/services/cctService';
import type { ExpiredCCT } from '@/services/cctService';
import { useToast } from '@chakra-ui/react';
import { Alert, AlertIcon, AlertTitle, AlertDescription, Box, Text } from '@chakra-ui/react';
import { criarNotificacaoAlerta } from '@/services/notificacoes';
import { useAppNotifications } from '@/hooks/useAppNotifications';

export function EmployeeForm() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loadingPositions, setLoadingPositions] = useState(true);
  const [cct, setCCT] = useState<CCT | null>(null);
  const [loadingCCT, setLoadingCCT] = useState(false);
  const [expiredCCTs, setExpiredCCTs] = useState<ExpiredCCT[]>([]);
  const toast = useToast();
  const notifications = useAppNotifications();

  useEffect(() => {
    const loadPositions = async () => {
      try {
        const positionsList = await positionService.getAllPositions();
        setPositions(positionsList);
      } catch (error) {
        notifications.showError(
          'Erro ao carregar cargos',
          'Não foi possível carregar a lista de cargos. Tente novamente mais tarde.',
          { persistent: true }
        );
      } finally {
        setLoadingPositions(false);
      }
    };

    const loadExpiredCCTs = async () => {
      try {
        const expiredList = await cctService.getExpiredCCTs();
        setExpiredCCTs(expiredList);
        
        // Notificar sobre CCTs expiradas ou próximas de expirar
        expiredList.forEach(cct => {
          if (cct.isExpired) {
            notifications.showWarning(
              'CCT Expirada',
              `A CCT para ${cct.position} no estado ${cct.state} expirou em ${cct.validityEnd?.toLocaleDateString()}`,
              { 
                persistent: true,
                pushNotification: true,
                sms: true 
              }
            );
          } else {
            notifications.showWarning(
              'CCT Próxima de Expirar',
              `A CCT para ${cct.position} no estado ${cct.state} expira em ${cct.daysUntilExpiration} dias`,
              { 
                persistent: true,
                pushNotification: true 
              }
            );
          }
        });
      } catch (error) {
        notifications.showError(
          'Erro ao verificar CCTs',
          'Não foi possível verificar o status das CCTs.',
          { persistent: true }
        );
      }
    };

    loadPositions();
    loadExpiredCCTs();
  }, [notifications]);

  useEffect(() => {
    const loadCCT = async () => {
      if (!formData.state || !formData.position) {
        setCCT(null);
        return;
      }

      setLoadingCCT(true);
      try {
        const cctData = await cctService.getCCTByStateAndPosition(
          formData.state,
          formData.position
        );
        setCCT(cctData);
      } catch (error) {
        console.error('Erro ao carregar CCT:', error);
      } finally {
        setLoadingCCT(false);
      }
    };

    loadCCT();
  }, [formData.state, formData.position, loadCCT, setCCT, setLoadingCCT, cctService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cct && formData.salary < cct.salary) {
      const message = `O salário informado (R$ ${formData.salary.toFixed(2)}) está abaixo do piso salarial estabelecido na CCT (R$ ${cct.salary.toFixed(2)})`;
      await criarNotificacaoAlerta('admin', message);
      
      toast({
        title: 'Atenção',
        description: message,
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!cct) {
      const message = `Não foi encontrada uma CCT válida para o estado ${formData.state} e cargo ${formData.position}`;
      await criarNotificacaoAlerta('admin', message);
      
      toast({
        title: 'Atenção',
        description: message,
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // ... rest of the submit logic ...
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... existing form fields ... */}
      
      <FormControl isRequired>
        <FormLabel>Cargo</FormLabel>
        <select
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          required
          disabled={loadingPositions}
          aria-label="Selecione o cargo do empregado"
        >
          <option value="">Selecione um cargo</option>
          {positions.map((position) => (
            <option key={position.id} value={position.name}>
              {position.name}
            </option>
          ))}
        </select>
        {loadingPositions && <Text>Carregando cargos...</Text>}
      </FormControl>

      {cct && (
        <Alert status="info" mt={4}>
          <AlertIcon />
          <Box>
            <AlertTitle>CCT Vigente</AlertTitle>
            <AlertDescription>
              Piso salarial: R$ {cct.salary.toFixed(2)}<br />
              Validade: {cct.validityStart.toLocaleDateString()} a {cct.validityEnd.toLocaleDateString()}<br />
              {cct.documentUrl && (
                <Text mt={2}>
                  <a href={cct.documentUrl} target="_blank" rel="noopener noreferrer">
                    Ver documento da CCT
                  </a>
                </Text>
              )}
            </AlertDescription>
          </Box>
        </Alert>
      )}

      {!cct && formData.state && formData.position && !loadingCCT && (
        <Alert status="warning" mt={4}>
          <AlertIcon />
          <AlertTitle>Atenção</AlertTitle>
          <AlertDescription>
            Não foi encontrada uma CCT válida para o estado e cargo selecionados
          </AlertDescription>
        </Alert>
      )}

      {expiredCCTs.length > 0 && (
        <Alert status="error" mt={4}>
          <AlertIcon />
          <Box>
            <AlertTitle>CCTs Expiradas ou Próximas de Expirar</AlertTitle>
            <AlertDescription>
              {expiredCCTs.map((expiredCCT) => (
                <Text key={expiredCCT.id} mt={2}>
                  {expiredCCT.state} - {expiredCCT.position}:{' '}
                  {expiredCCT.isExpired
                    ? 'Expirada em ' + expiredCCT.validityEnd?.toLocaleDateString()
                    : `Expira em ${expiredCCT.daysUntilExpiration} dias`}
                </Text>
              ))}
            </AlertDescription>
          </Box>
        </Alert>
      )}

      {/* ... rest of the form ... */}
    </form>
  );
} 