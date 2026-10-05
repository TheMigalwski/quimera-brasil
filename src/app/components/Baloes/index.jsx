"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import styles from "./Baloes.module.css";
import ThreadPanel from "../ThreadPanel";

const SPEED = 1.5;

function randomVel() {
  const angle = Math.random() * Math.PI * 2;
  return { vx: Math.cos(angle) * SPEED, vy: Math.sin(angle) * SPEED };
}

export default function Baloes() {
  const [texto, setTexto] = useState("");
  const [threadAberta, setThreadAberta] = useState(null);
  const [avisoLimite, setAvisoLimite] = useState(false);
  const avisoTimer = useRef(null);
  const [, forceRender] = useState(0);
  const containerRef = useRef(null);
  const baloesRef = useRef([]);
  const elRefs = useRef([]);
  const rafRef = useRef(null);

  const initBalao = useCallback((mensagem) => {
    const container = containerRef.current;
    const cw = container ? container.offsetWidth : 800;
    const ch = container ? container.offsetHeight : 400;
    const vel = randomVel();
    return {
      ...mensagem,
      msg: mensagem.texto,
      x: Math.random() * (cw - 200),
      y: Math.random() * (ch - 50),
      ...vel,
      w: 0,
      h: 0,
    };
  }, []);

  useEffect(() => {
    fetch("/api/mensagens")
      .then((r) => r.json())
      .then((mensagens) => {
        baloesRef.current = mensagens.map((m) => initBalao(m));
        forceRender((n) => n + 1);
      });
  }, [initBalao]);

  useEffect(() => {
    function measure() {
      baloesRef.current.forEach((b, i) => {
        const el = elRefs.current[i];
        if (el) {
          b.w = el.offsetWidth;
          b.h = el.offsetHeight;
        }
      });
    }

    function checkCollision(a, b) {
      return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
      );
    }

    function tick() {
      const container = containerRef.current;
      if (!container) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const cw = container.offsetWidth;
      const ch = container.offsetHeight;

      measure();

      const items = baloesRef.current;
      for (let i = 0; i < items.length; i++) {
        const b = items[i];
        b.x += b.vx;
        b.y += b.vy;

        if (b.x <= 0) { b.x = 0; b.vx = Math.abs(b.vx); }
        if (b.x + b.w >= cw) { b.x = cw - b.w; b.vx = -Math.abs(b.vx); }
        if (b.y <= 0) { b.y = 0; b.vy = Math.abs(b.vy); }
        if (b.y + b.h >= ch) { b.y = ch - b.h; b.vy = -Math.abs(b.vy); }

        for (let j = i + 1; j < items.length; j++) {
          const o = items[j];
          if (checkCollision(b, o)) {
            const cx1 = b.x + b.w / 2, cy1 = b.y + b.h / 2;
            const cx2 = o.x + o.w / 2, cy2 = o.y + o.h / 2;
            let dx = cx1 - cx2, dy = cy1 - cy2;
            if (dx === 0 && dy === 0) { dx = 1; dy = 1; }
            const overlapX = (b.w / 2 + o.w / 2) - Math.abs(dx);
            const overlapY = (b.h / 2 + o.h / 2) - Math.abs(dy);
            const pushX = (dx > 0 ? 1 : -1) * (overlapX / 2 + 1);
            const pushY = (dy > 0 ? 1 : -1) * (overlapY / 2 + 1);
            if (overlapX < overlapY) {
              b.x += pushX; o.x -= pushX;
              const tempVx = b.vx; b.vx = o.vx; o.vx = tempVx;
            } else {
              b.y += pushY; o.y -= pushY;
              const tempVy = b.vy; b.vy = o.vy; o.vy = tempVy;
            }
          }
        }

        const el = elRefs.current[i];
        if (el) {
          el.style.transform = `translate(${b.x}px, ${b.y}px)`;
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  async function enviar() {
    const msg = texto.trim();
    if (!msg) return;
    const res = await fetch("/api/mensagens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto: msg }),
    });
    const nova = await res.json();
    baloesRef.current.push(initBalao(nova));
    setTexto("");
    forceRender((n) => n + 1);
  }

  async function responder(mensagemId, textoResposta) {
    const res = await fetch(`/api/mensagens/${mensagemId}/respostas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto: textoResposta }),
    });
    const resposta = await res.json();
    const balao = baloesRef.current.find((b) => b.id === mensagemId);
    if (balao) {
      balao.respostas.push(resposta);
      setThreadAberta({ ...balao, respostas: [...balao.respostas] });
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") enviar();
  }

  return (
    <div className={styles.container}>
      <div className={styles.baloes} ref={containerRef}>
        {baloesRef.current.map((item, i) => {
          const replies = item.respostas?.length || 0;
          const scale = 1 + Math.min(replies, 10) * 0.1;
          return (
            <div
              key={item.id}
              ref={(el) => (elRefs.current[i] = el)}
              className={`${styles.balao} ${replies ? styles.comRespostas : ""}`}
              style={{
                fontSize: `${16 * scale}px`,
                padding: `${14 * scale}px ${22 * scale}px`,
              }}
              onClick={() => setThreadAberta(item)}
            >
              {item.msg}
              {replies > 0 && (
                <span className={styles.badge}>{replies}</span>
              )}
            </div>
          );
        })}
      </div>
      <div className={styles.inputArea}>
        <div className={styles.inputWrapper}>
          <input
            className={styles.input}
            type="text"
            placeholder="O que o Brasil precisa ouvir?"
            value={texto}
            onChange={(e) => {
              const val = e.target.value;
              if (val.length > 50) {
                setTexto(val.slice(0, 50));
                setAvisoLimite(true);
                clearTimeout(avisoTimer.current);
                avisoTimer.current = setTimeout(() => setAvisoLimite(false), 2500);
              } else {
                setTexto(val);
              }
            }}
            onKeyDown={handleKeyDown}
          />
          {avisoLimite && (
            <div className={styles.aviso}>Limite de 50 caracteres</div>
          )}
        </div>
        <button className={styles.enviar} onClick={enviar} aria-label="Enviar">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>

      {threadAberta && (
        <ThreadPanel
          mensagem={threadAberta}
          onClose={() => setThreadAberta(null)}
          onReply={responder}
        />
      )}
    </div>
  );
}
