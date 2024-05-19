/* eslint-disable no-useless-escape */
import { useState, ChangeEvent } from "react";
import styles from "./styles/registration.module.scss";
import axios from "axios";
import Input from "../Elements/Input/Input";

import { RegistrationProps } from "./types/Registration.types";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import Button from "../Elements/Button/Button";
import { useNavigate } from "react-router-dom";
import { SetUserDataProps } from "../../app.type";
const Registration: React.FC<SetUserDataProps> = ({ setUserData }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imgError, setImgError] = useState<string | null>(null);
  const [inputsDataError, setInputsDataError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [inputsData, setInputsData] = useState<RegistrationProps | null>({
    login: "",
    email: "",
    password: "",
    userAvatar: false,
  });
  const navigate = useNavigate();
  function isValidEmail(email: string) {
    return typeof email === "string" && email.includes("@");
  }
  function isValidText(text: string) {
    const regex = /^[a-zA-Z0-9 !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;

    return regex.test(text);
  }
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Перевірка розміру файлу (наприклад, максимум 2 МБ)
      const maxSize = 2 * 1024 * 1024; // 2 МБ
      if (file.size > maxSize) {
        setImgError("File size exceeds 2 MB");
        setSelectedFile(null);
        setPreview(null);
        return;
      }

      // Перевірка розширення файлу
      const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
      if (!allowedExtensions.exec(file.name)) {
        setImgError(
          "Invalid file type. Only JPG, JPEG, PNG and GIF files are allowed."
        );
        setSelectedFile(null);
        setPreview(null);
        return;
      }

      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setImgError(null);
    }
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (
      (!selectedFile && inputsData?.userAvatar) ||
      !inputsData?.login ||
      !inputsData?.email ||
      !inputsData?.password
    ) {
      let causeError: string = "";
      if (!selectedFile && inputsData?.userAvatar)
        causeError = "Вы хотите установить свой аватар, но не выбрали фото";
      if (!inputsData?.login) causeError = "Вы не указали логин";
      if (!inputsData?.email) causeError = "Вы не указали почту";
      if (!inputsData?.password) causeError = "Вы не указали пароль";

      setInputsDataError(causeError);
      return;
    } else if (!isValidEmail(inputsData?.email)) {
      setInputsDataError("Почта указана неверно");
      return;
    } else if (
      !isValidText(inputsData?.email) ||
      !isValidText(inputsData?.login) ||
      !isValidText(inputsData?.password)
    ) {
      setInputsDataError("Запрещены русские символы");
      return;
    } else if (imgError != null) {
      setInputsDataError(imgError);
      return;
    } else if (inputsData?.password.length <= 6) {
      setInputsDataError("Пароль должен состоять минимум из 6 символов");
      return;
    }

    const formData = new FormData();
    if (selectedFile) formData.append("avatar", selectedFile);
    if (inputsData.userAvatar != undefined)
      formData.append("userAvatar", String(inputsData.userAvatar));
    formData.append("login", inputsData.login);
    formData.append("email", inputsData.email);
    formData.append("password", inputsData.password);

    try {
      await axios
        .post(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/registration`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        )
        .then((response) => {
          if (response) {
            console.log(response.data);
            setUserData((prevData) => ({ ...prevData, authorized: true }));
            navigate("/");
          } else {
            setInputsDataError("Неизвестная ошибка на стороне сервера");
          }
        })
        .catch((error) => {
          setInputsDataError(error.response.data.message);
        });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setInputsDataError(error.response.data.message);
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
  const handleAvatarCheckbox = () => {
    setImgError(null);
    setInputsData((prevData) => ({
      ...prevData,
      userAvatar: !prevData?.userAvatar,
    }));
  };
  return (
    <div className={styles["registration"]}>
      {" "}
      <form className={styles["registration-form"]} onSubmit={handleSubmit}>
        <div className={styles["form-avatarBlock"]}>
          <div className={styles["avatarBlock-checkbox"]}>
            <input
              className={styles["checkbox__input"]}
              type="checkbox"
              checked={inputsData?.userAvatar}
              onChange={handleAvatarCheckbox}
              name="notuserAvatar"
              id="notuserAvatar"
            />
            <h2
              onClick={handleAvatarCheckbox}
              className={`${styles["checkbox__text"]} ${styles["noSelect"]}`}
            >
              Установить свой аватар
            </h2>
          </div>
          {inputsData?.userAvatar &&
            (preview ? (
              <img
                className={styles["avatarBlock__avatar"]}
                src={preview}
                alt="Avatar Preview"
              />
            ) : (
              <div className={styles["avatarBlock__avatar"]}></div>
            ))}
          {inputsData?.userAvatar && (
            <>
              {" "}
              <input
                className={styles["avatarBlock__inputFile"]}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <h2 className={styles["avatarBlock__error"]}>{imgError}</h2>
            </>
          )}
        </div>
        <div className={styles["form-inputsBlock"]}>
          <div className={styles["inputsBlock__login"]}>
            <Input
              placeholder="Логин"
              type="text"
              name="login"
              value={inputsData?.login}
              onChange={(event) => handleInputChange("login", event)}
            />
          </div>
          <div className={styles["inputsBlock__login"]}>
            <Input
              placeholder="Почта"
              type="text"
              name="email"
              value={inputsData?.email}
              onChange={(event) => handleInputChange("email", event)}
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
        </div>
        <h2 className={styles["form__error"]}>{inputsDataError}</h2>
        <div className={styles["form__button"]}>
          <Button onClick={handleSubmit} text="Зарегестрироваться" />
        </div>
      </form>
    </div>
  );
};

export default Registration;
