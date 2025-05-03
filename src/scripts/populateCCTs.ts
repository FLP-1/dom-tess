import { cctService } from '@/services/cctService';
import { Document } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const exampleCCTs = [
  {
    state: 'SP',
    position: 'Empregada Doméstica',
    salary: 1500.00,
    validityStart: new Date('2023-01-01'),
    validityEnd: new Date('2023-12-31'),
    document: {
      id: uuidv4(),
      type: 'contract',
      title: 'CCT SP - Empregada Doméstica',
      url: 'https://example.com/cct-sp-2023.pdf',
      userId: 'admin',
      uploadedAt: new Date(),
      expiresAt: new Date('2023-12-31'),
      size: 1024
    } as Document
  },
  {
    state: 'SP',
    position: 'Cozinheira',
    salary: 1800.00,
    validityStart: new Date('2023-01-01'),
    validityEnd: new Date('2023-12-31'),
    document: {
      id: uuidv4(),
      type: 'contract',
      title: 'CCT SP - Cozinheira',
      url: 'https://example.com/cct-sp-2023.pdf',
      userId: 'admin',
      uploadedAt: new Date(),
      expiresAt: new Date('2023-12-31'),
      size: 1024
    } as Document
  },
  {
    state: 'RJ',
    position: 'Empregada Doméstica',
    salary: 1600.00,
    validityStart: new Date('2023-01-01'),
    validityEnd: new Date('2023-12-31'),
    document: {
      id: uuidv4(),
      type: 'contract',
      title: 'CCT RJ - Empregada Doméstica',
      url: 'https://example.com/cct-rj-2023.pdf',
      userId: 'admin',
      uploadedAt: new Date(),
      expiresAt: new Date('2023-12-31'),
      size: 1024
    } as Document
  },
  {
    state: 'RJ',
    position: 'Cozinheira',
    salary: 1900.00,
    validityStart: new Date('2023-01-01'),
    validityEnd: new Date('2023-12-31'),
    document: {
      id: uuidv4(),
      type: 'contract',
      title: 'CCT RJ - Cozinheira',
      url: 'https://example.com/cct-rj-2023.pdf',
      userId: 'admin',
      uploadedAt: new Date(),
      expiresAt: new Date('2023-12-31'),
      size: 1024
    } as Document
  }
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