const PORT = 3000;

//libs
const cookieParser = require("cookie-parser");
import express, { Request, Response } from "express";
import cors from "cors";
import path from "node:path";
import dotenv from "dotenv";
import routes from "./routes";
dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));

// Обробка статичних файлів з папки 'uploads'
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", routes);
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
