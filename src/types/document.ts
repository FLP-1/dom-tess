import { IBaseDocument, EStatus } from './common';

export type TDocumentStatus = EStatus;
export type TDocumentType = 
  | 'rg'
  | 'cpf'
  | 'cnh'
  | 'ctps'
  | 'pis'
  | 'titulo_eleitor'
  | 'reservista'
  | 'diploma'
  | 'certificado'
  | 'contrato'
  | 'outros';

export interface IDocument extends IBaseDocument {
  type: TDocumentType;
  status: TDocumentStatus;
  metadata?: Record<string, unknown>;
}

export interface DocumentUploadOptions {
  type: TDocumentType;
  title: string;
  userId: string;
  expiresAt?: string;
  metadata?: IDocument['metadata'];
}

export interface DocumentFilter {
  userId?: string;
  type?: TDocumentType;
  status?: TDocumentStatus;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
}

export interface DocumentSort {
  field: keyof IDocument;
  direction: 'asc' | 'desc';
}

export interface DocumentPagination {
  page: number;
  limit: number;
  total?: number;
}

export interface DocumentListResponse {
  documents: IDocument[];
  pagination: DocumentPagination;
}

export interface DocumentValidationResult {
  isValid: boolean;
  errors: {
    type?: string;
    title?: string;
    file?: string;
    metadata?: {
      [key: string]: string;
    };
  };
} 