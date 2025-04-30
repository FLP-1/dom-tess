import { JobPositionsService } from '../services/jobPositionsService';
import { jobTitles } from '../utils/jobTitles';
import { departments } from '../utils/departments';

async function populateJobPositions() {
  try {
    // Criar cargos para cada departamento
    for (const department of departments) {
      // Para cada cargo, criar uma posição no departamento correspondente
      for (const title of jobTitles) {
        await JobPositionsService.createJobPosition({
          title,
          department,
          description: `Cargo de ${title} no departamento de ${department}`
        });
      }
    }

    console.log('Cargos populados com sucesso!');
  } catch (error) {
    console.error('Erro ao popular cargos:', error);
  }
}

// Executar o script
populateJobPositions(); 