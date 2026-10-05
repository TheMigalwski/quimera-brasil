"use client";

import { useState } from "react";
import styles from "./ThreadPanel.module.css";

export default function ThreadPanel({ mensagem, onClose, onReply }) {
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviarResposta() {
    const msg = texto.trim();
    if (!msg || enviando) return;
    setEnviando(true);
    await onReply(mensagem.id, msg);
    setTexto("");
    setEnviando(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarResposta();
    }
  }

  function formatarData(iso) {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <button className={styles.fechar} onClick={onClose} aria-label="Fechar">
          &times;
        </button>

        <div className={styles.original}>
          <p className={styles.originalTexto}>{mensagem.msg}</p>
          <span className={styles.data}>{formatarData(mensagem.criadoEm)}</span>
        </div>

        <div className={styles.respostas}>
          {mensagem.respostas.length === 0 && (
            <p className={styles.vazio}>Nenhuma resposta ainda. Seja o primeiro!</p>
          )}
          {mensagem.respostas.map((r) => (
            <div key={r.id} className={styles.resposta}>
              <p>{r.texto}</p>
              <span className={styles.data}>{formatarData(r.criadoEm)}</span>
            </div>
          ))}
        </div>

        <div className={styles.inputArea}>
          <textarea
            className={styles.input}
            placeholder="Responda essa ideia..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
          />
          <button
            className={styles.enviar}
            onClick={enviarResposta}
            disabled={enviando || !texto.trim()}
          >
            Responder
          </button>
        </div>
      </div>
    </div>
  );
}
