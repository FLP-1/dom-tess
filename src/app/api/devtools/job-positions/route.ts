import { NextRequest, NextResponse } from "next/server";
import admin from 'firebase-admin';
import { getFirestore } from "firebase-admin/firestore";
import path from 'path';
import fs from 'fs';
import { jobTitles } from '@/utils/jobTitles';

// Inicializa o Firebase Admin se ainda não estiver inicializado
if (!admin.apps.length) {
  const serviceAccountPath = path.join(process.cwd(), 'src/secrets/serviceAccountKey.json');
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://dom-v2-tess-default-rtdb.firebaseio.com"
  });
}

const db = getFirestore();

export async function POST(req: NextRequest) {
  try {
    const batch = db.batch();
    let count = 0;

    // Criar cargos
    for (const title of jobTitles) {
      const docRef = db.collection('jobPositions').doc();
      batch.set(docRef, {
        title,
        description: `Cargo de ${title}`,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      count++;
    }

    await batch.commit();
    return NextResponse.json({ 
      ok: true, 
      message: `${count} cargos criados com sucesso!` 
    });
  } catch (e) {
    return NextResponse.json({ 
      error: "Erro ao popular cargos", 
      details: String(e) 
    }, { status: 500 });
  }
} 