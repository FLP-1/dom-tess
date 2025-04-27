import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount = require("../../../../../secrets/serviceAccountKey.json");

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount)
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