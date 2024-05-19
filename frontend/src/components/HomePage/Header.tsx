//components
import { useNavigate } from "react-router-dom";
import Button from "../Elements/Button/Button";
//css
import styles from "./styles/homePage.module.scss";
import { UserDataProps } from "./types/HomePage.types";
//types
const Header: React.FC<UserDataProps> = ({ userData, setUserData }) => {
  const navigate = useNavigate();
  function HandleButtonLoginClick() {
    navigate("/login");
  }
  function HandleButtonRegistrationClick() {
    navigate("/registration");
  }
  function HandleButtonLogoutClick() {
    setUserData((prevData) => ({ ...prevData, authorized: false }));
    navigate("/logout");
  }
  return (
    <header className={styles["header"]}>
      {userData?.authorized ? (
        <div>
          <h3>authorized</h3>
          <Button onClick={HandleButtonLogoutClick} text="Logout" />
        </div>
      ) : (
        <div className={styles["header-buttons"]}>
          <Button onClick={HandleButtonLoginClick} text="Login" />
          <h2 className={styles["buttons__text"]}>or</h2>
          <Button onClick={HandleButtonRegistrationClick} text="Register" />
        </div>
      )}
    </header>
  );
};

export default Header;
