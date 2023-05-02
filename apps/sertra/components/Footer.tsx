import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.service}>Thunderstore 2022</h2>
        <a href="https://discord.com/invite/UWpWhjZken">Discord</a>
      </div>
    </footer>
  );
}
