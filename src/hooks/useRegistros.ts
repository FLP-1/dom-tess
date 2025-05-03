import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
import { buscarRegistros, calcularHorasTrabalhadas } from '@/services/registros';

interface RegistroPonto {
  id: string;
  userId: string;
  tipo: 'entrada' | 'saida' | 'intervalo';
  dataHora: Date;
  localizacao: { lat: number; lng: number };
  wifi: string;
  observacao: string;
  createdAt: Date;
}

interface HorasTrabalhadas {
  horas: number;
  minutos: number;
}

export function useRegistros(userId: string, dataInicio?: Date, dataFim?: Date) {
  const [registros, setRegistros] = useState<RegistroPonto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [horasTrabalhadas, setHorasTrabalhadas] = useState<HorasTrabalhadas>({ horas: 0, minutos: 0 });

  useEffect(() => {
    let unsubscribe: () => void;

    const setupRegistros = async () => {
      try {
        // Carrega os registros iniciais
        const registrosIniciais = await buscarRegistros(userId, dataInicio, dataFim);
        setRegistros(registrosIniciais);

        // Calcula horas trabalhadas
        if (dataInicio && dataFim) {
          const horas = await calcularHorasTrabalhadas(userId, dataInicio, dataFim);
          setHorasTrabalhadas(horas);
        }

        // Configura o listener em tempo real
        let q = query(
          collection(db, 'registros_ponto'),
          where('userId', '==', userId),
          orderBy('dataHora', 'desc')
        );

        if (dataInicio && dataFim) {
          q = query(
            q,
            where('dataHora', '>=', Timestamp.fromDate(dataInicio)),
            where('dataHora', '<=', Timestamp.fromDate(dataFim))
          );
        }

        unsubscribe = onSnapshot(q, (snapshot) => {
          const novosRegistros = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            dataHora: doc.data().dataHora.toDate(),
            createdAt: doc.data().createdAt.toDate(),
          })) as RegistroPonto[];

          setRegistros(novosRegistros);

          // Recalcula horas trabalhadas
          if (dataInicio && dataFim) {
            calcularHorasTrabalhadas(userId, dataInicio, dataFim)
              .then(setHorasTrabalhadas)
              .catch(console.error);
          }
        });
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    setupRegistros();

    // Limpa o listener quando o componente é desmontado
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userId, dataInicio, dataFim, setRegistros, setHorasTrabalhadas, setError, setLoading]);

  const registrosHoje = registros.filter(registro => {
    const hoje = new Date();
    const dataRegistro = registro.dataHora;
    return (
      dataRegistro.getDate() === hoje.getDate() &&
      dataRegistro.getMonth() === hoje.getMonth() &&
      dataRegistro.getFullYear() === hoje.getFullYear()
    );
  });

  return {
    registros,
    registrosHoje,
    horasTrabalhadas,
    loading,
    error,
  };
} 