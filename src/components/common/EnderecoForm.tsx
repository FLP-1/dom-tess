import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  FormErrorMessage,
  Tooltip,
  InputGroup,
  InputRightElement,
  Spinner,
  Box,
} from '@chakra-ui/react';
import { SelectField } from './SelectField';
import { Endereco, useEndereco } from '@/hooks/useEndereco';
import { InfoIcon } from '@chakra-ui/icons';
import { MaskedInput, masks } from './MaskedInput';
import { AutocompleteInput } from './AutocompleteInput';
import { useCidades } from '@/hooks/useCidades';

const ESTADOS = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' }
];

interface EnderecoFormProps {
  enderecoInicial?: Partial<Endereco>;
  onChange: (endereco: Partial<Endereco>) => void;
}

export function EnderecoForm({ enderecoInicial, onChange }: EnderecoFormProps) {
  const {
    endereco,
    errors,
    loading,
    handleChange,
    buscarCEP,
  } = useEndereco({
    enderecoInicial,
    onEnderecoChange: onChange,
  });

  const { cidades, loading: loadingCidades, filtrarCidades } = useCidades(endereco.uf || '');

  const handleCidadeSelect = (cidade: string) => {
    handleChange('cidade', cidade);
  };

  return (
    <VStack spacing={4} align="stretch">
      <FormControl isInvalid={!!errors.cep}>
        <FormLabel>
          CEP
          <Tooltip label="Digite o CEP para preencher automaticamente o endereço">
            <InfoIcon ml={2} color="blue.500" />
          </Tooltip>
        </FormLabel>
        <InputGroup>
          <MaskedInput
            value={endereco.cep}
            onChange={e => buscarCEP(e.target.value)}
            placeholder="00000-000"
            maxLength={9}
            isDisabled={loading}
            aria-label="CEP"
            aria-describedby="cep-help"
            mask={masks.cep}
          />
          {loading && (
            <InputRightElement>
              <Spinner size="sm" />
            </InputRightElement>
          )}
        </InputGroup>
        <FormErrorMessage>{errors.cep}</FormErrorMessage>
        <Box id="cep-help" fontSize="sm" color="gray.500" mt={1}>
          Digite o CEP para preencher automaticamente o endereço
        </Box>
      </FormControl>

      <FormControl isInvalid={!!errors.logradouro}>
        <FormLabel>Logradouro</FormLabel>
        <Input
          value={endereco.logradouro}
          onChange={e => handleChange('logradouro', e.target.value)}
          placeholder="Digite o logradouro"
          isDisabled={loading}
          aria-label="Logradouro"
        />
        <FormErrorMessage>{errors.logradouro}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.numero}>
        <FormLabel>Número</FormLabel>
        <Input
          value={endereco.numero}
          onChange={e => handleChange('numero', e.target.value)}
          placeholder="Digite o número"
          aria-label="Número"
        />
        <FormErrorMessage>{errors.numero}</FormErrorMessage>
      </FormControl>

      <FormControl>
        <FormLabel>
          Complemento
          <Tooltip label="Informações adicionais como apartamento, bloco, etc.">
            <InfoIcon ml={2} color="blue.500" />
          </Tooltip>
        </FormLabel>
        <Input
          value={endereco.complemento}
          onChange={e => handleChange('complemento', e.target.value)}
          placeholder="Digite o complemento"
          aria-label="Complemento"
        />
      </FormControl>

      <FormControl isInvalid={!!errors.bairro}>
        <FormLabel>Bairro</FormLabel>
        <Input
          value={endereco.bairro}
          onChange={e => handleChange('bairro', e.target.value)}
          placeholder="Digite o bairro"
          isDisabled={loading}
          aria-label="Bairro"
        />
        <FormErrorMessage>{errors.bairro}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.cidade}>
        <FormLabel>Cidade</FormLabel>
        <AutocompleteInput
          value={endereco.cidade}
          onChange={e => handleChange('cidade', e.target.value)}
          onSelect={handleCidadeSelect}
          options={cidades.map(c => c.nome)}
          isLoading={loadingCidades}
          placeholder="Digite a cidade"
          isDisabled={loading}
          aria-label="Cidade"
        />
        <FormErrorMessage>{errors.cidade}</FormErrorMessage>
      </FormControl>

      <SelectField
        label="UF"
        name="uf"
        value={endereco.uf || ''}
        onChange={(value) => handleChange('uf', value)}
        options={ESTADOS}
        placeholder="Selecione o estado"
        error={errors.uf}
        isRequired
        isDisabled={loading}
        aria-label="Estado"
      />

      <FormControl>
        <FormLabel>País</FormLabel>
        <Input
          value={endereco.pais}
          onChange={e => handleChange('pais', e.target.value)}
          placeholder="Digite o país"
          aria-label="País"
        />
      </FormControl>
    </VStack>
  );
} 