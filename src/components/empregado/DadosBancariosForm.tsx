import { SelectCustom } from '../common/SelectCustom';

<SelectCustom
  label="Tipo de Conta"
  options={[
    { value: 'corrente', label: 'Conta Corrente' },
    { value: 'poupanca', label: 'Conta Poupança' }
  ]}
  value={tipoConta}
  onChange={(e) => setTipoConta(e.target.value)}
  isRequired
/> 