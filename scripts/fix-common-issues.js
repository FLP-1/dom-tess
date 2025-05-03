const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Função para corrigir imports do Select
function fixSelectImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes("import { Select } from '@chakra-ui/react'")) {
    content = content.replace(
      "import { Select } from '@chakra-ui/react'",
      "import { SelectCustom } from '@/components/common/SelectCustom'"
    );
    content = content.replace(/<Select/g, '<SelectCustom');
    content = content.replace(/<\/Select/g, '</SelectCustom');
    fs.writeFileSync(filePath, content);
    console.log(`Corrigido Select em ${filePath}`);
  }
}

// Função para corrigir imports do Button
function fixButtonImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('<Button') && !content.includes("import { Button } from '@chakra-ui/react'")) {
    content = "import { Button } from '@chakra-ui/react';\n" + content;
    fs.writeFileSync(filePath, content);
    console.log(`Adicionado import do Button em ${filePath}`);
  }
}

// Função para corrigir imports do FormControl e FormLabel
function fixFormImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if ((content.includes('<FormControl') || content.includes('<FormLabel')) && 
      !content.includes("import { FormControl, FormLabel } from '@chakra-ui/react'")) {
    content = "import { FormControl, FormLabel } from '@chakra-ui/react';\n" + content;
    fs.writeFileSync(filePath, content);
    console.log(`Adicionado import do FormControl/FormLabel em ${filePath}`);
  }
}

// Função para corrigir dependências do useEffect
function fixUseEffectDeps(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const useEffectRegex = /useEffect\(\(\) => \{\s*([\s\S]*?)\s*\}, \[([\s\S]*?)\]\)/g;
  let match;
  while ((match = useEffectRegex.exec(content)) !== null) {
    const [fullMatch, effectBody, deps] = match;
    const usedVars = effectBody.match(/\b\w+\b/g) || [];
    const missingDeps = usedVars.filter(v => 
      !deps.includes(v) && 
      !['useEffect', 'console', 'window', 'document', 'navigator'].includes(v)
    );
    if (missingDeps.length > 0) {
      const newDeps = [...new Set([...deps.split(',').map(d => d.trim()), ...missingDeps])]
        .filter(d => d)
        .join(', ');
      content = content.replace(fullMatch, `useEffect(() => {\n${effectBody}\n}, [${newDeps}])`);
      console.log(`Corrigido useEffect em ${filePath}`);
    }
  }
  fs.writeFileSync(filePath, content);
}

// Função para processar todos os arquivos
function processFiles() {
  const srcDir = path.join(process.cwd(), 'src');
  const files = getAllFiles(srcDir);

  files.forEach(file => {
    if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fixSelectImports(file);
      fixButtonImports(file);
      fixFormImports(file);
      fixUseEffectDeps(file);
    }
  });
}

// Função auxiliar para listar todos os arquivos
function getAllFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      files.push(...getAllFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Executar o script
processFiles(); 