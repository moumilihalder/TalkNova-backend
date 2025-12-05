import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import askRoute from "./api/ask.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", askRoute);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Local server running on http://localhost:${PORT}`);
});
