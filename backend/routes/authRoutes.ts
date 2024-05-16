//libs
import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import fs from "node:fs";
import path from "node:path";
//types
import { RegistrationProps } from "../types/app.types";
//functions
import searchUserIdDb from "../dataBase/functions/searchUserIdDb";
import addUserInDb from "../dataBase/functions/addUserInDb";

const router = Router();

const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, "../uploads/");
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
const upload = multer({ storage });

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

export default router;
