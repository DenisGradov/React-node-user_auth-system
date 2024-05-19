//libs
import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
const bcrypt = require("bcrypt");
import fs from "fs";
import path from "path";
//types
import { LoginUserDataProps, RegistrationProps } from "../types/app.types";
//functions
import searchUserIdDb from "../dataBase/functions/searchUserIdDb";
import addUserInDb from "../dataBase/functions/addUserInDb";
import getUserRowDb from "../dataBase/functions/getUserRowDb";
import updateUserCookie from "../dataBase/functions/updateUserCookie";

const router = Router();

// Define the absolute path to the uploads directory
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, uploadsDir);
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

router.post("/verifyToken", (req: Request, res: Response) => {
  const cookieToken = req.cookies.token;
  console.log(cookieToken);
  if (cookieToken) {
    searchUserIdDb({
      tableName: "users",
      searchKey: "cookie",
      searchValue: cookieToken,
    })
      .then((userFind) => {
        if (userFind) return res.status(200).json({ authorized: true });
        return res.status(200).json({ authorized: false });
      })
      .catch((err) => {
        console.error("Error during registration:", err);
        return res.status(300).send(err);
      });
  } else {
    return res.status(200).send("User not found");
  }
});

router.post("/logout", (req: Request, res: Response) => {
  const nullMs = 0;
  console.log("s");
  res.cookie("token", "", {
    httpOnly: true,
    maxAge: nullMs,
    sameSite: "lax",
  });
  res.status(200).send("Logout ok");
});

router.post("/registration", upload.single("avatar"), (req, res) => {
  const inputsData: RegistrationProps = req.body;
  const { login, email, password, userAvatar } = inputsData;
  const secretKey = process.env.SECRET_KEY_FOR_COOKIE;
  if (!secretKey) {
    console.error("SECRET_KEY_FOR_COOKIE is not defined");
    return res.status(500).send("Internal server error");
  }
  let filePath = "";
  if (!userAvatar) {
    filePath = "default.png";
  } else {
    if (req.file) {
      filePath = req.file.filename;
    } else {
      filePath = "default.png";
    }
  }
  const cookieToken = jwt.sign({ login }, secretKey, {
    expiresIn: "30d",
  });

  addUserInDb({
    password,
    email,
    login,
    admin: 0,
    cookieToken,
    avatar: filePath,
  })
    .then((successRegister) => {
      if (successRegister) {
        const oneMonthInMs = 30 * 24 * 60 * 60 * 1000;
        res.cookie("token", cookieToken, {
          httpOnly: true,
          maxAge: oneMonthInMs,
          sameSite: "lax",
        });
        res.status(200).send("Registration successfully");
      } else {
        res.status(500).send("Error during registration");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(300).send({ message: err.message });
    });
});

router.post("/login", upload.none(), (req, res) => {
  const inputsData: LoginUserDataProps = req.body;
  const { login, password } = inputsData;
  console.log(req.body);
  const secretKey = process.env.SECRET_KEY_FOR_COOKIE;
  if (!secretKey) {
    console.error("SECRET_KEY_FOR_COOKIE is not defined");
    return res.status(500).send("Internal server error");
  }

  getUserRowDb({
    tableName: "users",
    searchKey:
      typeof login === "string" && login.includes("@") ? "email" : "login",
    searchValue: login,
  })
    .then((userData) => {
      console.log(login);
      console.log(login?.toString().includes("@") ? "email" : "login");
      if (userData) {
        if (userData.password) {
          bcrypt.compare(
            password,
            userData.password,
            (err: Error | null, isMatch: boolean) => {
              if (err) {
                console.error("Ошибка при проверке пароля:", err);
                res
                  .status(300)
                  .send({ message: `Ошибка при проверке пароля:, ${err}` });
                return;
              } else {
                if (isMatch) {
                  console.log("Пароль совпадает!");

                  const cookieToken = jwt.sign(
                    { login: userData["login"] },
                    secretKey,
                    {
                      expiresIn: "30d",
                    }
                  );

                  updateUserCookie({
                    tableName: "users",
                    login: userData["login"],
                    newCookieToken: cookieToken,
                  })
                    .then((successUpdateCookie) => {
                      if (successUpdateCookie) {
                        const oneMonthInMs = 30 * 24 * 60 * 60 * 1000;
                        res.cookie("token", cookieToken, {
                          httpOnly: true,
                          maxAge: oneMonthInMs,
                          sameSite: "lax",
                        });
                        res.status(200).send("Login successfully");
                      } else {
                        res
                          .status(300)
                          .send({ message: `Error during login!` });
                      }
                    })
                    .catch((err) => {
                      console.error(err);
                      res.status(300).send({ message: err.message });
                    });
                } else {
                  res.status(300).send({ message: `Не верный пароль!` });
                  return;
                }
              }
            }
          );
        } else {
          console.error("Error during check password");
          res.status(300).send({ message: `Error during check password` });
          return;
        }
      } else {
        console.log("Юзер не найден");
        res.status(300).send({ message: "Юзер не найден" });
        return;
      }
    })
    .catch((err) => {
      console.error("Error during login:", err);
      res.status(300).send(`Error during login:, ${err}`);
      return;
    });
});

export default router;
