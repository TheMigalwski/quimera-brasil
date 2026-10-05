import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

const DATA_DIR = join(process.cwd(), "data");
const DATA_FILE = join(DATA_DIR, "mensagens.json");

async function getMensagens() {
  try {
    const raw = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function saveMensagens(mensagens) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(mensagens, null, 2));
}

export async function GET() {
  const mensagens = await getMensagens();
  return Response.json(mensagens);
}

export async function POST(request) {
  const { texto } = await request.json();
  if (!texto?.trim()) {
    return Response.json({ error: "Texto é obrigatório" }, { status: 400 });
  }
  if (texto.trim().length > 50) {
    return Response.json({ error: "Máximo 50 caracteres" }, { status: 400 });
  }
  const mensagens = await getMensagens();
  const nova = {
    id: randomUUID(),
    texto: texto.trim(),
    criadoEm: new Date().toISOString(),
    respostas: [],
  };
  mensagens.push(nova);
  await saveMensagens(mensagens);
  return Response.json(nova, { status: 201 });
}
