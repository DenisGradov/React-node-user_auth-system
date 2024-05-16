import { InputProps } from "./types/Input.types";

import styles from "./styles/input.module.scss";
const Input: React.FC<InputProps> = ({
  placeholder,
  onClick,
  onChange,
  type,
  value,
  name,
}) => {
  return (
    <input
      className={styles.input}
      placeholder={placeholder}
      onClick={onClick}
      onChange={onChange}
      value={value}
      type={type}
      name={name}
    />
  );
};

export default Input;
