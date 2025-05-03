import { Button } from '@chakra-ui/react';
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { cctService } from '@/services/cctService';
import { useToast } from '@/components/ui/use-toast';
import { uploadDocument } from '@/services/documentService';
import { Document } from '@/types';

const cctSchema = z.object({
  state: z.string().min(1, 'Estado é obrigatório'),
  position: z.string().min(1, 'Cargo é obrigatório'),
  salary: z.number().min(0, 'Salário deve ser maior que 0'),
  validityStart: z.string().min(1, 'Data de início é obrigatória'),
  validityEnd: z.string().min(1, 'Data de término é obrigatória'),
  document: z.instanceof(File).refine((file) => file.size > 0, 'Documento é obrigatório'),
});

type CCTFormData = z.infer<typeof cctSchema>;

export function CCTUploadForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CCTFormData>({
    resolver: zodResolver(cctSchema),
  });

  const onSubmit = async (data: CCTFormData) => {
    try {
      setIsLoading(true);

      // Upload do documento
      const document = await uploadDocument({
        file: data.document,
        type: 'contract',
        title: `CCT - ${data.state} - ${data.position}`,
        expiresAt: new Date(data.validityEnd),
      });

      // Criar CCT
      await cctService.createCCT({
        state: data.state,
        position: data.position,
        salary: data.salary,
        validityStart: new Date(data.validityStart),
        validityEnd: new Date(data.validityEnd),
        document,
      });

      toast({
        title: 'Sucesso',
        description: 'CCT cadastrada com sucesso',
      });
    } catch (error) {
      console.error('Erro ao cadastrar CCT:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao cadastrar CCT',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="state">Estado</Label>
        <Select
          id="state"
          {...register('state')}
          error={errors.state?.message}
        >
          <option value="">Selecione um estado</option>
          <option value="AC">Acre</option>
          <option value="AL">Alagoas</option>
          <option value="AP">Amapá</option>
          <option value="AM">Amazonas</option>
          <option value="BA">Bahia</option>
          <option value="CE">Ceará</option>
          <option value="DF">Distrito Federal</option>
          <option value="ES">Espírito Santo</option>
          <option value="GO">Goiás</option>
          <option value="MA">Maranhão</option>
          <option value="MT">Mato Grosso</option>
          <option value="MS">Mato Grosso do Sul</option>
          <option value="MG">Minas Gerais</option>
          <option value="PA">Pará</option>
          <option value="PB">Paraíba</option>
          <option value="PR">Paraná</option>
          <option value="PE">Pernambuco</option>
          <option value="PI">Piauí</option>
          <option value="RJ">Rio de Janeiro</option>
          <option value="RN">Rio Grande do Norte</option>
          <option value="RS">Rio Grande do Sul</option>
          <option value="RO">Rondônia</option>
          <option value="RR">Roraima</option>
          <option value="SC">Santa Catarina</option>
          <option value="SP">São Paulo</option>
          <option value="SE">Sergipe</option>
          <option value="TO">Tocantins</option>
        </Select>
      </div>

      <div>
        <Label htmlFor="position">Cargo</Label>
        <Input
          id="position"
          {...register('position')}
          error={errors.position?.message}
        />
      </div>

      <div>
        <Label htmlFor="salary">Salário Base</Label>
        <Input
          id="salary"
          type="number"
          step="0.01"
          {...register('salary', { valueAsNumber: true })}
          error={errors.salary?.message}
        />
      </div>

      <div>
        <Label htmlFor="validityStart">Data de Início</Label>
        <Input
          id="validityStart"
          type="date"
          {...register('validityStart')}
          error={errors.validityStart?.message}
        />
      </div>

      <div>
        <Label htmlFor="validityEnd">Data de Término</Label>
        <Input
          id="validityEnd"
          type="date"
          {...register('validityEnd')}
          error={errors.validityEnd?.message}
        />
      </div>

      <div>
        <Label htmlFor="document">Documento</Label>
        <Input
          id="document"
          type="file"
          accept=".pdf"
          {...register('document')}
          error={errors.document?.message}
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Cadastrando...' : 'Cadastrar CCT'}
      </Button>
    </form>
  );
} 