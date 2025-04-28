import { NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import path from 'path';
import fs from 'fs';

// Inicializa o Firebase Admin se ainda não estiver inicializado
if (!admin.apps.length) {
  const serviceAccountPath = path.join(process.cwd(), 'src/secrets/serviceAccountKey.json');
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://dom-v2-tess-default-rtdb.firebaseio.com",
    storageBucket: "dom-v2-300b5.appspot.com"
  });
}

const db = getFirestore();
const bucket = getStorage().bucket();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const metadata = JSON.parse(formData.get('metadata') as string);

    if (!file || !metadata) {
      return NextResponse.json(
        { error: 'Arquivo e metadados são obrigatórios' },
        { status: 400 }
      );
    }

    // Upload do arquivo para o Firebase Storage
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;
    const fileRef = bucket.file(`documents/${fileName}`);

    await fileRef.save(fileBuffer, {
      metadata: {
        contentType: file.type,
      },
    });

    // Salvar metadados no Firestore
    const docRef = await db.collection('documents').add({
      name: file.name,
      fileName,
      uploadDate: new Date(),
      expirationDate: new Date(metadata.expirationDate),
      responsible: metadata.responsible,
      accessLevel: metadata.accessLevel,
      url: await fileRef.getSignedUrl({
        action: 'read',
        expires: '03-01-2500', // URL válida por muito tempo
      }),
    });

    return NextResponse.json({
      id: docRef.id,
      name: file.name,
      url: await fileRef.getSignedUrl({
        action: 'read',
        expires: '03-01-2500',
      }),
    });
  } catch (error) {
    console.error('Erro ao fazer upload do documento:', error);
    return NextResponse.json(
      { error: 'Erro ao fazer upload do documento' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const snapshot = await db.collection('documents').get();
    const documents = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Erro ao buscar documentos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar documentos' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID do documento é obrigatório' },
        { status: 400 }
      );
    }

    const docRef = db.collection('documents').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Documento não encontrado' },
        { status: 404 }
      );
    }

    const data = doc.data();
    if (data?.fileName) {
      // Excluir arquivo do Storage
      await bucket.file(`documents/${data.fileName}`).delete();
    }

    // Excluir documento do Firestore
    await docRef.delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir documento:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir documento' },
      { status: 500 }
    );
  }
} 