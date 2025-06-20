// scripts/create-modules.js
const fs = require('fs');
const path = require('path');

const base = process.cwd();      // assume E:\git-dom
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

for (const mod of modules) {
  for (const side of ['backend', 'frontend']) {
    const fullPath = path.join(base, side, mod);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`✔ Criada: ${fullPath}`);
    } else {
      console.log(`ℹ Já existe: ${fullPath}`);
    }
  }
}
