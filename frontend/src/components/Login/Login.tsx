import { useState, ChangeEvent } from "react";
import Input from "../Elements/Input/Input";
import styles from "./login.module.scss";
import { LoginUserDataProps } from "./Login.type";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import Button from "../Elements/Button/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SetUserDataProps } from "../../app.type";
const Login: React.FC<SetUserDataProps> = ({ setUserData }) => {
  const navigate = useNavigate();
  const [inputsData, setInputsData] = useState<LoginUserDataProps | null>({
    login: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [serverAnswerError, setServerAnswerError] = useState<string>("");
  const handleSubmit = async (event: React.FormEvent) => {
    try {
      event.preventDefault();
      if (!inputsData || !inputsData.login || !inputsData.password) {
        setServerAnswerError("Внутренняя ошибка");
        return;
      }
      const formData = new FormData();
      formData.append("login", inputsData.login);
      formData.append("password", inputsData.password);
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        })
        .then((response) => {
          if (response) {
            console.log(response.data);
            setUserData((prevData) => ({ ...prevData, authorized: true }));
            navigate("/");
          } else {
            console.log("Неизвестная ошибка на стороне сервера");
          }
        })
        .catch((error) => {
          console.log(error.response.data.message);
          setServerAnswerError(error.response.data.message);
        });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log(error.response.data.message);
      }
      console.error("Error registration:", error);
    }
  };
  const handleInputChange = (
    dataForChange: string,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    event.target.value.length < 30 &&
      setInputsData((prevData) => ({
        ...prevData,
        [dataForChange]: event.target.value,
      }));
  };
  return (
    <div className={styles["login"]}>
      {" "}
      <form className={styles["login-form"]} onSubmit={handleSubmit}>
        <div className={styles["form-inputsBlock"]}>
          <div className={styles["inputsBlock__login"]}>
            <Input
              placeholder="Логин или почта"
              type="text"
              name="login"
              value={inputsData?.login}
              onChange={(event) => handleInputChange("login", event)}
            />
          </div>
          <div className={styles["inputsBlock__password"]}>
            <Input
              placeholder="Пароль"
              type={showPassword ? "text" : "password"}
              name="password"
              value={inputsData?.password}
              onChange={(event) => handleInputChange("password", event)}
            />

            {showPassword ? (
              <RiEyeFill
                onClick={() => setShowPassword(false)}
                className={`${styles["inputsBlock__password-icon"]} ${styles["noSelect"]}`}
              />
            ) : (
              <RiEyeOffFill
                onClick={() => setShowPassword(true)}
                className={`${styles["inputsBlock__password-icon"]} ${styles["noSelect"]}`}
              />
            )}
          </div>
          <h2 className={styles["form__error"]}>{serverAnswerError}</h2>
          <div className={styles["form__button"]}>
            <Button onClick={handleSubmit} text="Авторизоваться" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
