import sqlite3 from "sqlite3";
sqlite3.verbose();
import { RegistrationProps } from "../../types/app.types";
import searchUserIdDb from "./searchUserIdDb";
const bcrypt = require("bcrypt");

function addUserInDb({
  password,
  email,
  login,
  admin,
  cookieToken,
  avatar,
}: RegistrationProps): Promise<boolean> {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err: Error | null, hash: string) => {
      if (err) {
        console.error("Ошибка при хешировании:", err);
        return reject(new Error("Ошибка при хешировании"));
      } else {
        const db = new sqlite3.Database("./dataBase/dataBase.db");

        searchUserIdDb({
          tableName: "users",
          searchKey: "email",
          searchValue: email,
        })
          .then((successRegister) => {
            if (successRegister) {
              return reject(new Error("Указанная почта уже используется"));
            } else {
              searchUserIdDb({
                tableName: "users",
                searchKey: "login",
                searchValue: login,
              }).then((successRegister2) => {
                if (successRegister2) {
                  return reject(new Error("Указанный логин уже используется"));
                } else {
                  db.run(
                    "INSERT INTO users (email, login, password, admin, cookie, avatar) VALUES (?, ?, ?, ?, ?, ?)",
                    [email, login, hash, admin, cookieToken, avatar], // Используем хэш пароля вместо оригинала
                    function (err) {
                      if (err) {
                        console.error("Ошибка при записи в базу данных:", err);
                        db.close();
                        return reject(
                          new Error("Ошибка при записи в базу данных")
                        );
                      } else {
                        console.log("Пользователь добавлен с ID:", this.lastID);
                        db.close();
                        return resolve(true);
                      }
                    }
                  );
                }
              });
            }
          })
          .catch((err) => {
            console.error("Error during registration:", err);
          });
      }
    });
  });
}

export default addUserInDb;
