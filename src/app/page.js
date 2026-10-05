import Menu from "./components/Menu";
import Baloes from "./components/Baloes";
import Rodape from "./components/Rodape";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <Menu />

      <section id="inicio" className={styles.pautas}>
        <div className={styles.hero}>
          <h1 className={styles.titulo}>
            <span className={styles.quimera}>Quimera</span>{" "}
            <span className={styles.brasil}>Brasil</span>
          </h1>
          <div className={styles.linha} />
          <p className={styles.subtitulo}>
            Cada voz importa. Diga o que o Brasil precisa ouvir.
          </p>
        </div>
        <Baloes />
      </section>

      <section id="manifesto" className={styles.manifestoWrapper}>
        <div className={styles.faixaLateral} />
        <article className={styles.manifesto}>
        <header className={styles.manifestoHeader}>
          <h2 className={styles.manifestoTitulo}>Manifesto</h2>
          <p className={styles.manifestoAbertura}>
            O Brasil tem 200 milhões de vozes.<br />
            Este é o espaço delas.
          </p>
        </header>

        <div className={styles.secao}>
          <h3>O problema</h3>
          <p>
            O cidadão comum foi empurrado para as margens do debate público.
            Entre a polarização que transforma diálogo em guerra e os canais
            institucionais que ninguém entende, sobrou silêncio — ou grito
            sem destino.
          </p>
          <p>
            As redes sociais prometeram dar voz a todos, mas entregaram
            algoritmos que premiam o ódio e enterram a proposta. Quem tem
            algo construtivo a dizer não encontra onde ser ouvido.
          </p>
          <p>
            O resultado é um país onde milhões pensam parecido sobre o que
            precisa mudar, mas nunca descobrem isso — porque ninguém criou
            o espaço certo para essa conversa acontecer.
          </p>
        </div>

        <div className={styles.secao}>
          <h3>No que acreditamos</h3>
          <ul className={styles.principios}>
            <li>
              <strong>Sem partido, sem patrão.</strong> Aqui não tem bandeira
              vermelha nem verde-amarela. Tem cidadão.
            </li>
            <li>
              <strong>Voz igual para todos.</strong> Não importa de onde você
              vem, quanto ganha ou em quem votou. Sua ideia vale o mesmo.
            </li>
            <li>
              <strong>Proposta, não culpa.</strong> Apontar problemas é fácil.
              Queremos quem aponte caminhos.
            </li>
            <li>
              <strong>Diálogo, não monólogo.</strong> Discordar faz parte.
              Desrespeitar, não.
            </li>
            <li>
              <strong>Transparência radical.</strong> Tudo aberto, tudo
              visível. Se é público, tem que ser público de verdade.
            </li>
          </ul>
        </div>

        <div className={styles.secao}>
          <h3>O que queremos</h3>
          <p>
            Que você fale. Não amanhã, não quando tiver certeza, não quando
            for conveniente. Agora.
          </p>
          <p>
            Que as pautas que importam para o Brasil de verdade — saúde,
            educação, segurança, trabalho, meio ambiente — deixem de ser
            promessa de campanha e virem cobrança permanente.
          </p>
          <p>
            Que cada ideia jogada aqui encontre outras parecidas, ganhe
            força, vire proposta concreta, e chegue onde precisa chegar.
          </p>
        </div>

        <div className={`${styles.secao} ${styles.convite}`}>
          <h3>O convite</h3>
          <p>
            Quimera Brasil é uma criatura feita de muitas partes — como o
            próprio país. Sozinhas, as vozes se perdem. Juntas, elas mudam
            o que precisa ser mudado.
          </p>
          <p className={styles.chamada}>
            Diga o que o Brasil precisa ouvir.
          </p>
          <a href="#pautas" className={styles.botao}>
            Participar agora
          </a>
        </div>
        </article>
        <div className={styles.faixaLateral} />
      </section>

      <Rodape />
    </main>
  );
}
