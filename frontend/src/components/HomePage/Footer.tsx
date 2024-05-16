import styles from "./styles/homePage.module.scss";
const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <ul className={styles.footer__list}>
        <li className={styles.footer__item}>
          <a
            className={styles.footer__link}
            href="https://github.com/DenisGradov"
            target="_blank"
          >
            Made by DenisGradov
          </a>
        </li>
        <li className={styles.footer__item}>Copyright 2024</li>
      </ul>
    </footer>
  );
};

export default Footer;
