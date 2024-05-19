import sqlite3 from "sqlite3";
import { searchUserIdDbProps } from "../../types/app.types";
sqlite3.verbose();

function getUserRowDb({
  tableName,
  searchKey,
  searchValue,
}: searchUserIdDbProps): Promise<Record<string, any> | null> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(
      "./dataBase/dataBase.db",
      sqlite3.OPEN_READONLY,
      (err) => {
        if (err) {
          console.error(err.message);
          return reject(new Error(err.message));
        }
      }
    );

    const sql = `SELECT * FROM ${tableName} WHERE ${searchKey} = ?`;

    db.get(sql, [searchValue], (err, row: Record<string, any> | undefined) => {
      if (err) {
        return reject(new Error(err.message));
      }
      if (row) {
        return resolve(row); // Возвращаем найденную строку
      } else {
        return resolve(null); // Строка не найдена
      }
    });

    db.close((err) => {
      if (err) {
        return reject(new Error(err.message));
      }
    });
  });
}

export default getUserRowDb;
