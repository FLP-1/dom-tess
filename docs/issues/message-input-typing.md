# Problema de Tipagem no MessageInput

## Contexto

O componente `MessageInput` está apresentando problemas de tipagem relacionados à integração entre o Chakra UI, o HOC `withAccessibility` e as interfaces base do projeto.

## Problemas Identificados

1. **Incompatibilidade de Tipos de Eventos**
```typescript
// Atual
onChange?: (value: string) => void;

// Esperado pelo Chakra UI
onChange?: React.ChangeEventHandler<HTMLInputElement>;
```

2. **Hierarquia de Tipos**
- `BaseInputProps` (nosso tipo base)
- `InputProps` (tipo do Chakra UI)
- `MessageInputProps` (tipo específico do componente)
- Conflito na extensão e composição destes tipos

3. **HOC withAccessibility**
- Espera componentes que implementem `BaseFieldProps`
- `MessageInput` tem props específicas que não fazem parte de `BaseFieldProps`
- Possível rigidez excessiva na tipagem do HOC

## Impactos

1. **UI/UX**
- Componente continua funcionando corretamente
- Não há impacto visível para o usuário
- Mantém todas as funcionalidades de acessibilidade

2. **Desenvolvimento**
- Erros de TypeScript no desenvolvimento
- Possível dificuldade em manutenção futura
- Pode afetar a integração com outros componentes

3. **Performance**
- Sem impacto direto na performance
- Tipagem não afeta o runtime
- HOC adiciona uma camada extra de componente (comum em React)

## Possíveis Soluções

1. **Revisão de BaseInputProps**
```typescript
interface BaseInputProps extends Omit<InputProps, 'onChange'> {
  onChange?: (value: string) => void;
  // ... outras props específicas
}
```

2. **HOC Específico**
```typescript
function withMessageAccessibility<P extends MessageInputProps>(
  Component: React.ComponentType<P>
) {
  // Implementação específica para componentes de mensagem
}
```

3. **Remover HOC**
```typescript
// Implementar acessibilidade diretamente no componente
// Pros: Mais simples, menos camadas
// Contras: Possível duplicação de código
```

## Recomendações

1. **Curto Prazo**
- Manter o componente como está
- Adicionar `// @ts-ignore` temporariamente nos erros de tipo
- Documentar decisão em comentários no código

2. **Médio Prazo**
- Revisar a arquitetura de tipos do projeto
- Avaliar necessidade do HOC de acessibilidade
- Criar testes automatizados

3. **Longo Prazo**
- Considerar migração para uma abordagem mais flexível
- Avaliar uso de Hooks vs HOCs
- Padronizar tratamento de tipos em toda a aplicação

## Próximos Passos

1. Agendar reunião técnica para discussão
2. Criar POC com diferentes abordagens
3. Definir estratégia de migração
4. Estabelecer padrões de tipagem para o projeto

## Referências

- [TypeScript Handbook - Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Chakra UI TypeScript Guide](https://chakra-ui.com/docs/styled-system/typescript) 