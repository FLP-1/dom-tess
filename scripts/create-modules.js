// E:\git-dom\scripts\create-modules.js
const fs = require('fs');
const path = require('path');

// Base do seu repositório:
const base = path.resolve(__dirname, '..'); // vai resolver para E:\git-dom

// Lista de módulos que queremos criar
const modules = [
  'Registro_Autenticacao_Onboarding',
  'Dashboards_por_Perfil',
  'Registro_de_Ponto',
  'Gestao_de_Documentos',
  'Compras_e_Atividades',
  'Comunicacao_Interna_Chat',
  'Calculo_Salarial_Gestao_Emprestimos',
  'White_Label_e_Assinaturas',
  'Seguranca_Compliance_e_Monitoramento',
  'Infraestrutura_e_Testes'
];

// Para cada lado (backend/frontend) e para cada módulo, crie a pasta
for (const side of ['backend','frontend']) {
  for (const mod of modules) {
    const fullPath = path.join(base, side, mod);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`✔ Criada: ${fullPath}`);
    } else {
      console.log(`ℹ Já existe: ${fullPath}`);
    }
  }
}
