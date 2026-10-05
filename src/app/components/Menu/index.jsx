import Image from "next/image";
import styles from "./Menu.module.css";

export default function Menu() {
  return (
    <nav className={styles.nav}>
      <a href="#" className={styles.flag}>
        <Image src="/icon.svg" alt="Bandeira do Brasil" width={36} height={36} />
      </a>
      <ul className={styles.links}>
        <li><a href="#inicio">Início</a></li>
        <li><a href="#manifesto">Manifesto</a></li>
        <li><a href="#pautas">Pautas</a></li>
        <li><a href="#sobre">Sobre</a></li>
      </ul>
    </nav>
  );
}
