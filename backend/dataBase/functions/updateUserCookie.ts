import sqlite3 from "sqlite3";
sqlite3.verbose();
import { updateCookieProps } from "../../types/app.types";
import searchUserIdDb from "./searchUserIdDb";

function updateUserCookie({
  tableName,
  login,
  newCookieToken,
}: updateCookieProps): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database("./dataBase/dataBase.db");

    // Проверка наличия пользователя с указанным логином
    searchUserIdDb({
      tableName: tableName,
      searchKey: "login",
      searchValue: login,
    })
      .then((userExists) => {
        if (!userExists) {
          db.close();
          return reject(
            new Error("Пользователь с указанным логином не найден")
          );
        } else {
          const sql = `UPDATE ${tableName} SET cookie = ? WHERE login = ?`;

          db.run(sql, [newCookieToken, login], function (err) {
            if (err) {
              console.error("Ошибка при обновлении куки в базе данных:", err);
              db.close();
              return reject(
                new Error("Ошибка при обновлении куки в базе данных")
              );
            } else {
              console.log(
                "Куки успешно обновлен для пользователя с логином:",
                login
              );
              db.close();
              return resolve(true);
            }
          });
        }
      })
      .catch((err) => {
        console.error("Ошибка при проверке пользователя:", err);
        db.close();
        return reject(new Error("Ошибка при проверке пользователя"));
      });
  });
}

export default updateUserCookie;
