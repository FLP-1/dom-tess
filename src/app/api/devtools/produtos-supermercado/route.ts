import { NextRequest, NextResponse } from "next/server";
import admin from 'firebase-admin';
import { getFirestore } from "firebase-admin/firestore";
import path from 'path';
import fs from 'fs';

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
    const produtos = await req.json();
    const batch = db.batch();
    produtos.forEach((produto: any) => {
      const ref = db.collection("products").doc(produto.id);
      batch.set(ref, produto);
    });
    await batch.commit();
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Erro ao popular produtos", details: String(e) }, { status: 500 });
  }
} 