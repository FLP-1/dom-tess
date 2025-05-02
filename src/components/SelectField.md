# SelectField

O `SelectField` é um componente reutilizável que encapsula as boas práticas de acessibilidade para campos de seleção.

## Características

- Integração com Chakra UI
- Acessibilidade completa (ARIA labels, IDs únicos)
- Suporte a validação
- Estilização consistente
- Tipagem TypeScript

## Como Usar

1. Importe o componente:

```typescript
import { SelectField } from '@/components/SelectField';
```

2. Defina as opções:

```typescript
const options = [
  { value: 'valor1', label: 'Label 1' },
  { value: 'valor2', label: 'Label 2' }
];
```

3. Use o componente:

```typescript
<SelectField
  label="Nome do Campo"
  options={options}
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Selecione uma opção"
  isRequired
  formControlProps={{ maxW: "200px" }}
/>
```

## Props

| Prop | Tipo | Descrição |
|------|------|-----------|
| label | string | Rótulo do campo |
| options | Array<{ value: string, label: string }> | Opções do select |
| value | string | Valor selecionado |
| onChange | function | Função chamada quando o valor muda |
| placeholder | string | Texto placeholder |
| isRequired | boolean | Se o campo é obrigatório |
| formControlProps | object | Props adicionais para o FormControl |

## Exemplos

### Select Simples

```typescript
<SelectField
  label="Status"
  options={[
    { value: 'active', label: 'Ativo' },
    { value: 'inactive', label: 'Inativo' }
  ]}
  value={status}
  onChange={(e) => setStatus(e.target.value)}
/>
```

### Select com Validação

```typescript
<SelectField
  label="Tipo de Documento"
  options={documentTypes}
  value={type}
  onChange={(e) => setType(e.target.value)}
  isRequired
  isInvalid={!type && wasSubmitted}
/>
```

### Select com Largura Personalizada

```typescript
<SelectField
  label="Filtrar por"
  options={filterOptions}
  value={filter}
  onChange={(e) => setFilter(e.target.value)}
  formControlProps={{ maxW: "200px" }}
/>
```

## Boas Práticas

1. Sempre forneça um label descritivo
2. Use placeholder quando apropriado
3. Indique campos obrigatórios com isRequired
4. Mantenha as opções consistentes (value/label)
5. Forneça feedback visual para estados de erro

## Acessibilidade

O componente implementa as seguintes práticas de acessibilidade:

- Labels associados corretamente
- IDs únicos gerados automaticamente
- Atributos ARIA apropriados
- Suporte a navegação por teclado
- Estados visuais claros 