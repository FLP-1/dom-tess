import { SelectCustom } from '../common/SelectCustom';

<SelectCustom
  label="Grau de Instrução"
  options={[
    { value: 'fundamental', label: 'Ensino Fundamental' },
    { value: 'medio', label: 'Ensino Médio' },
    { value: 'superior', label: 'Ensino Superior' },
    { value: 'pos', label: 'Pós-Graduação' }
  ]}
  value={grauInstrucao}
  onChange={(e) => setGrauInstrucao(e.target.value)}
  isRequired
/> 