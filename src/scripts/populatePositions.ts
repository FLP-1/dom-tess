import { positionService } from '@/services/positionService';

const commonPositions = [
  { name: 'Empregada Doméstica', description: 'Realiza serviços gerais de limpeza e organização' },
  { name: 'Cozinheira', description: 'Responsável pela preparação de refeições' },
  { name: 'Babá', description: 'Cuida de crianças' },
  { name: 'Cuidador de Idosos', description: 'Auxilia e cuida de pessoas idosas' },
  { name: 'Lavadeira', description: 'Responsável pela lavagem e cuidado de roupas' },
  { name: 'Passadeira', description: 'Responsável pela passagem de roupas' },
  { name: 'Governanta', description: 'Supervisiona e coordena os serviços domésticos' },
  { name: 'Motorista Particular', description: 'Responsável pelo transporte da família' },
  { name: 'Jardineiro', description: 'Cuida da manutenção de jardins e áreas verdes' },
  { name: 'Caseiro', description: 'Responsável pela manutenção e segurança da residência' },
  { name: 'Auxiliar de Cozinha', description: 'Auxilia na preparação de refeições' },
  { name: 'Auxiliar de Limpeza', description: 'Auxilia nos serviços de limpeza' },
  { name: 'Cuidador de Animais', description: 'Cuida de animais de estimação' },
  { name: 'Acompanhante de Idosos', description: 'Acompanha e auxilia idosos em suas atividades' },
  { name: 'Auxiliar de Cuidados', description: 'Auxilia em cuidados básicos de saúde' },
  { name: 'Auxiliar de Serviços Gerais', description: 'Auxilia em diversas atividades domésticas' },
  { name: 'Auxiliar de Governanta', description: 'Auxilia a governanta em suas funções' },
  { name: 'Auxiliar de Babá', description: 'Auxilia a babá no cuidado com crianças' },
  { name: 'Auxiliar de Lavanderia', description: 'Auxilia nos serviços de lavanderia' },
  { name: 'Auxiliar de Jardinagem', description: 'Auxilia nos serviços de jardinagem' },
];

export async function populatePositions() {
  try {
    for (const position of commonPositions) {
      await positionService.createPosition(position);
      console.log(`Cargo ${position.name} criado com sucesso`);
    }
    console.log('Todos os cargos foram criados com sucesso');
  } catch (error) {
    console.error('Erro ao criar cargos:', error);
  }
} 