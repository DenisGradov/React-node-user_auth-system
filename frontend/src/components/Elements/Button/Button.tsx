import styles from "./styles/button.module.scss";
import { ButtonProps } from "./types/Button.types";
const Button: React.FC<ButtonProps> = ({ onClick, text }) => {
  return (
    <button onClick={onClick} className={styles.button}>
      {text}
    </button>
  );
};

export default Button;
