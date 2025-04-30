import { cctService } from '@/services/cctService';

const exampleCCTs = [
  {
    state: 'SP',
    position: 'Empregada Doméstica',
    salary: 1500.00,
    validityStart: new Date('2023-01-01'),
    validityEnd: new Date('2023-12-31'),
    documentUrl: 'https://example.com/cct-sp-2023.pdf',
  },
  {
    state: 'SP',
    position: 'Cozinheira',
    salary: 1800.00,
    validityStart: new Date('2023-01-01'),
    validityEnd: new Date('2023-12-31'),
    documentUrl: 'https://example.com/cct-sp-2023.pdf',
  },
  {
    state: 'RJ',
    position: 'Empregada Doméstica',
    salary: 1600.00,
    validityStart: new Date('2023-01-01'),
    validityEnd: new Date('2023-12-31'),
    documentUrl: 'https://example.com/cct-rj-2023.pdf',
  },
  {
    state: 'RJ',
    position: 'Cozinheira',
    salary: 1900.00,
    validityStart: new Date('2023-01-01'),
    validityEnd: new Date('2023-12-31'),
    documentUrl: 'https://example.com/cct-rj-2023.pdf',
  },
];

export async function populateCCTs() {
  try {
    for (const cct of exampleCCTs) {
      await cctService.createCCT(cct);
      console.log(`CCT para ${cct.state} - ${cct.position} criada com sucesso`);
    }
    console.log('Todas as CCTs foram criadas com sucesso');
  } catch (error) {
    console.error('Erro ao criar CCTs:', error);
  }
} 