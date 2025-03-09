import styles from "./Header.module.scss";

export const Header = () => {
  return (
    <header className={styles.root}>
      <div>
        <span className={styles.logo}>EVINCED</span>
      </div>
      <div>
        <button>Log Out</button>
      </div>
    </header>
  );
};
