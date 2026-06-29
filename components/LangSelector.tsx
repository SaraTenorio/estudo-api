import { useLang } from "@/lib/context";
import styles from "@/styles/LangSelector.module.css";

export function LangSelector() {
  const { lang, setLang } = useLang();

  return (
    <div className={styles.container}>
      <button
        onClick={() => setLang("en")}
        title="English"
        className={`${styles.button} ${lang === "en" ? styles.active : ""}`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("pt")}
        title="Português"
        className={`${styles.button} ${lang === "pt" ? styles.active : ""}`}
      >
        PT
      </button>
    </div>
  );
}
