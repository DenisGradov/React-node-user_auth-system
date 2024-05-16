//components
import { useNavigate } from "react-router-dom";
import Button from "../Elements/Button/Button";
//css
import styles from "./styles/homePage.module.scss";
//types
import { UserDataProps } from "./types/HomePage.types";
const Header: React.FC<{ userData?: UserDataProps }> = ({ userData }) => {
  const navigate = useNavigate();
  function HandleButtonClick() {
    alert("test");
  }
  function HandleButtonRegistrationClick() {
    navigate("/registration");
  }
  return (
    <header className={styles["header"]}>
      {userData?.authorized ? (
        <h1>authorized</h1>
      ) : (
        <div className={styles["header-buttons"]}>
          <Button onClick={HandleButtonClick} text="Login" />
          <h2 className={styles["buttons__text"]}>or</h2>
          <Button onClick={HandleButtonRegistrationClick} text="Register" />
        </div>
      )}
    </header>
  );
};

export default Header;
