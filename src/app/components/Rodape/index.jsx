import styles from "./Rodape.module.css";

export default function Rodape() {
  return (
    <footer id="sobre" className={styles.rodape}>
      <p className={styles.texto}>
        <strong>Quimera Brasil</strong> — plataforma apartidária de protesto
        e discussão sobre o futuro do país.
      </p>
      <p className={styles.sub}>
        Feito por cidadãos, para cidadãos.
      </p>
    </footer>
  );
}
