import type { NextApiRequest, NextApiResponse } from 'next';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { app } from '../../../lib/firebase-admin';

const parceiros = [
  { id: 'parceiro1', nome: 'Clínica Saúde' },
  { id: 'parceiro2', nome: 'Empresa XYZ' },
  { id: 'parceiro3', nome: 'Associação ABC' },
];

const tipos = ['empregador', 'empregado', 'familiar'];
const roles = ['employer', 'employee', 'familiar'];

function fakeAddress(idx: number) {
  return {
    street: `Rua Exemplo ${idx}`,
    number: `${100 + idx}`,
    complement: `Apto ${idx}`,
    neighborhood: `Bairro ${idx}`,
    city: `Cidade ${idx}`,
    state: 'SP',
    zipCode: `01000-0${idx}`,
    latitude: -23.5 + idx * 0.01,
    longitude: -46.6 + idx * 0.01,
  };
}

function fakeDocuments(idx: number) {
  return [
    {
      id: `doc${idx}`,
      type: 'cpf',
      title: `Documento CPF ${idx}`,
      url: `https://exemplo.com/doc${idx}.pdf`,
      uploadedAt: new Date().toISOString(),
      expiresAt: null,
    },
  ];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const db = getFirestore(app);
    const auth = getAuth(app);
    const now = new Date().toISOString();

    // Criar parceiros
    for (const parceiro of parceiros) {
      await db.collection('parceiros').doc(parceiro.id).set({ nome: parceiro.nome });
    }

    // Criar grupos e usuários
    let usuarios: Record<string, any> = {};
    let grupos: any[] = [];
    for (let i = 1; i <= 10; i++) {
      const parceiro = parceiros[i % parceiros.length];
      const grupoId = `grupo${i}`;
      const nomeGrupo = `Grupo ${i}`;
      const membros = [];
      for (let j = 0; j < 5; j++) {
        const idx = (i - 1) * 5 + j + 1;
        const cpf = String(10000000000 + idx);
        const tipo = tipos[j % tipos.length];
        const role = roles[j % roles.length];
        const nome = `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} ${idx}`;
        membros.push({ cpf, tipo, nome });
        // Prepara usuário
        if (!usuarios[cpf]) {
          usuarios[cpf] = {
            id: cpf,
            name: nome,
            email: `usuario${cpf}@teste.com`,
            cpf,
            phone: `1199999${('000' + idx).slice(-4)}`,
            role,
            photoURL: `https://api.dicebear.com/7.x/identicon/svg?seed=${cpf}`,
            isVerified: true,
            emailVerified: true,
            phoneVerified: false,
            createdAt: now,
            updatedAt: now,
            grupos: [],
            tipo,
            status: 'active',
            address: fakeAddress(idx),
            documents: fakeDocuments(idx),
          };
        }
        usuarios[cpf].grupos.push({
          grupoId,
          nomeGrupo,
          parceiroId: parceiro.id,
          nomeParceiro: parceiro.nome,
          tipo,
        });
      }
      const grupoData = {
        id: grupoId,
        nome: nomeGrupo,
        parceiroId: parceiro.id,
        nomeParceiro: parceiro.nome,
        membros,
      };
      grupos.push(grupoData);
      await db.collection('grupos').doc(grupoId).set(grupoData);
    }
    // Criar usuários no Auth e Firestore
    for (const [cpf, data] of Object.entries(usuarios)) {
      try {
        await auth.createUser({
          uid: cpf,
          email: data.email,
          password: 'Senha123*',
          displayName: data.name,
        });
      } catch (e: any) {
        if (e.code !== 'auth/email-already-exists' && e.code !== 'auth/uid-already-exists') {
          throw e;
        }
      }
      await db.collection('users').doc(cpf).set(data);
    }
    res.status(200).json({
      ok: true,
      parceiros,
      grupos,
      usuarios: Object.values(usuarios),
    });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
} 