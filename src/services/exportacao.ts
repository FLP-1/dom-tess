import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

interface DadosExportacao {
  headers: string[];
  rows: any[][];
  titulo?: string;
}

interface OpcoesExportacao {
  onProgress?: (progresso: number) => void;
  onError?: (erro: Error) => void;
  onSuccess?: () => void;
}

export async function exportarDados(
  dados: DadosExportacao, 
  formato: 'csv' | 'pdf' | 'xlsx',
  opcoes?: OpcoesExportacao
) {
  const nomeArquivo = `exportacao_${format(new Date(), 'yyyy-MM-dd')}`;

  try {
    switch (formato) {
      case 'csv':
        await exportarCSV(dados, nomeArquivo, opcoes);
        break;
      case 'xlsx':
        await exportarExcel(dados, nomeArquivo, opcoes);
        break;
      case 'pdf':
        await exportarPDF(dados, nomeArquivo, opcoes);
        break;
      default:
        throw new Error('Formato de exportação não suportado');
    }
    opcoes?.onSuccess?.();
  } catch (erro) {
    opcoes?.onError?.(erro instanceof Error ? erro : new Error('Erro desconhecido na exportação'));
    throw erro;
  }
}

async function exportarCSV(
  dados: DadosExportacao, 
  nomeArquivo: string,
  opcoes?: OpcoesExportacao
) {
  return new Promise<void>((resolve, reject) => {
    try {
      opcoes?.onProgress?.(0);
      
      const csvContent = [
        dados.headers.join(','),
        ...dados.rows.map(row => row.join(','))
      ].join('\n');

      opcoes?.onProgress?.(50);

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${nomeArquivo}.csv`;
      
      opcoes?.onProgress?.(75);
      
      link.click();
      URL.revokeObjectURL(link.href);
      
      opcoes?.onProgress?.(100);
      resolve();
    } catch (erro) {
      reject(erro);
    }
  });
}

async function exportarExcel(
  dados: DadosExportacao, 
  nomeArquivo: string,
  opcoes?: OpcoesExportacao
) {
  return new Promise<void>((resolve, reject) => {
    try {
      opcoes?.onProgress?.(0);
      
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet([dados.headers, ...dados.rows]);
      
      opcoes?.onProgress?.(50);
      
      XLSX.utils.book_append_sheet(wb, ws, 'Dados');
      
      opcoes?.onProgress?.(75);
      
      XLSX.writeFile(wb, `${nomeArquivo}.xlsx`);
      
      opcoes?.onProgress?.(100);
      resolve();
    } catch (erro) {
      reject(erro);
    }
  });
}

async function exportarPDF(
  dados: DadosExportacao, 
  nomeArquivo: string,
  opcoes?: OpcoesExportacao
) {
  return new Promise<void>((resolve, reject) => {
    try {
      opcoes?.onProgress?.(0);
      
      const doc = new jsPDF();
      
      opcoes?.onProgress?.(25);
      
      // Título do documento
      if (dados.titulo) {
        doc.setFontSize(16);
        doc.text(dados.titulo, 14, 15);
      }

      opcoes?.onProgress?.(50);
      
      // Tabela
      (doc as any).autoTable({
        head: [dados.headers],
        body: dados.rows,
        startY: dados.titulo ? 25 : 15,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185] },
        styles: { fontSize: 8 },
        margin: { top: 10, right: 10, bottom: 10, left: 10 },
      });

      opcoes?.onProgress?.(75);
      
      doc.save(`${nomeArquivo}.pdf`);
      
      opcoes?.onProgress?.(100);
      resolve();
    } catch (erro) {
      reject(erro);
    }
  });
} 