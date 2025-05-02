# Componentes de Formulário

## Visão Geral

Este documento descreve os componentes de formulário disponíveis no projeto, suas interfaces e como utilizá-los corretamente.

## Componentes Base

### FormInput

Componente básico de entrada de texto.

```tsx
import { FormInput } from '../components/common/FormInput';

<FormInput
  label="Nome"
  name="nome"
  value={value}
  onChange={handleChange}
  isRequired
  validationRules={[
    required('Nome é obrigatório'),
    minLength(3, 'Nome deve ter no mínimo 3 caracteres')
  ]}
/>
```

### MaskedInput

Componente de entrada com máscaras de formatação.

```tsx
import { MaskedInput } from '../components/common/MaskedInput';

<MaskedInput
  label="CPF"
  name="cpf"
  mask="cpf"
  value={value}
  onChange={handleChange}
  isRequired
  validationRules={[
    required('CPF é obrigatório'),
    cpf('CPF inválido')
  ]}
/>
```

### SelectField

Componente de seleção com suporte a grupos de opções.

```tsx
import { SelectField } from '../components/common/SelectField';

<SelectField
  label="Estado"
  name="estado"
  options={[
    { value: 'SP', label: 'São Paulo', group: 'Sudeste' },
    { value: 'RJ', label: 'Rio de Janeiro', group: 'Sudeste' },
    { value: 'MG', label: 'Minas Gerais', group: 'Sudeste' }
  ]}
  value={value}
  onChange={handleChange}
  isRequired
/>
```

### AutocompleteInput

Componente de autocompletar com suporte a máscaras e validações.

```tsx
import { AutocompleteInput } from '../components/common/AutocompleteInput';

<AutocompleteInput
  label="Cidade"
  name="cidade"
  options={[
    { value: '1', label: 'São Paulo' },
    { value: '2', label: 'Rio de Janeiro' }
  ]}
  value={value}
  onChange={handleChange}
  onSelect={handleSelect}
  minCharsToSearch={3}
  isRequired
/>
```

## Tipos e Interfaces

### BaseFieldProps

Interface base para todos os componentes de formulário.

```typescript
interface BaseFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  id?: string;
  name: string;
  width?: string | number;
  size?: 'sm' | 'md' | 'lg';
  validationRules?: ValidationRule[];
}
```

### BaseInputProps

Interface para componentes de entrada.

```typescript
interface BaseInputProps extends BaseFieldProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
}
```

### BaseSelectProps

Interface para componentes de seleção.

```typescript
interface BaseSelectProps extends BaseFieldProps {
  options: Array<{ value: string | number; label: string; group?: string }>;
  value?: string | number;
  placeholder?: string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
}
```

## Máscaras Disponíveis

- `cpf`: Formata CPF (000.000.000-00)
- `cnpj`: Formata CNPJ (00.000.000/0000-00)
- `phone`: Formata telefone ((00) 00000-0000)
- `date`: Formata data (00/00/0000)
- `currency`: Formata moeda (R$ 0,00)
- `percentage`: Formata porcentagem (0,00%)
- `zipcode`: Formata CEP (00000-000)
- `time`: Formata hora (00:00)
- `creditcard`: Formata cartão de crédito (0000 0000 0000 0000)
- `numbers`: Permite apenas números
- `letters`: Permite apenas letras
- `lettersAndNumbers`: Permite letras e números
- `removeAccents`: Remove acentos
- `uppercase`: Converte para maiúsculas
- `lowercase`: Converte para minúsculas
- `capitalize`: Capitaliza primeira letra

## Validações Disponíveis

- `required`: Campo obrigatório
- `email`: Valida e-mail
- `cpf`: Valida CPF
- `cnpj`: Valida CNPJ
- `phone`: Valida telefone
- `date`: Valida data
- `minLength`: Valida comprimento mínimo
- `maxLength`: Valida comprimento máximo
- `pattern`: Valida padrão (regex)
- `custom`: Validação customizada

## Acessibilidade

Todos os componentes seguem as melhores práticas de acessibilidade:

- Uso correto de labels e IDs
- Atributos ARIA apropriados
- Feedback visual e textual de erros
- Suporte a navegação por teclado
- Estados de foco, hover e disabled
- Mensagens de erro e ajuda
- Indicadores de campos obrigatórios

## Exemplos de Uso

### Formulário Completo

```tsx
import { FormContainer } from '../components/form/FormContainer';
import { FormInput } from '../components/common/FormInput';
import { MaskedInput } from '../components/common/MaskedInput';
import { SelectField } from '../components/common/SelectField';

const MyForm = () => {
  const handleSubmit = async (values) => {
    // Lógica de submissão
  };

  return (
    <FormContainer
      title="Cadastro de Cliente"
      description="Preencha os dados do cliente"
      onSubmit={handleSubmit}
      initialValues={{
        nome: '',
        cpf: '',
        estado: ''
      }}
    >
      <FormInput
        label="Nome"
        name="nome"
        isRequired
        validationRules={[
          required('Nome é obrigatório'),
          minLength(3, 'Nome deve ter no mínimo 3 caracteres')
        ]}
      />

      <MaskedInput
        label="CPF"
        name="cpf"
        mask="cpf"
        isRequired
        validationRules={[
          required('CPF é obrigatório'),
          cpf('CPF inválido')
        ]}
      />

      <SelectField
        label="Estado"
        name="estado"
        options={[
          { value: 'SP', label: 'São Paulo' },
          { value: 'RJ', label: 'Rio de Janeiro' }
        ]}
        isRequired
      />
    </FormContainer>
  );
};
```

## Boas Práticas

1. Sempre use o componente `FormContainer` para gerenciar o estado do formulário
2. Defina validações apropriadas para cada campo
3. Forneça mensagens de erro claras e úteis
4. Use máscaras quando apropriado para melhorar a UX
5. Mantenha a consistência no uso de labels e mensagens
6. Teste a acessibilidade do formulário
7. Documente campos customizados
