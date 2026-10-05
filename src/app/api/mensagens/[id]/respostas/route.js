import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

const DATA_FILE = join(process.cwd(), "data", "mensagens.json");

async function getMensagens() {
  const raw = await readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

async function saveMensagens(mensagens) {
  await writeFile(DATA_FILE, JSON.stringify(mensagens, null, 2));
}

export async function POST(request, { params }) {
  const { id } = await params;
  const { texto } = await request.json();
  if (!texto?.trim()) {
    return Response.json({ error: "Texto é obrigatório" }, { status: 400 });
  }
  const mensagens = await getMensagens();
  const msg = mensagens.find((m) => m.id === id);
  if (!msg) {
    return Response.json({ error: "Mensagem não encontrada" }, { status: 404 });
  }
  const resposta = {
    id: randomUUID(),
    texto: texto.trim(),
    criadoEm: new Date().toISOString(),
  };
  msg.respostas.push(resposta);
  await saveMensagens(mensagens);
  return Response.json(resposta, { status: 201 });
}
