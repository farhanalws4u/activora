import express from "express";
import { dbConnection } from "./Database/dbConnection.js";
import { bootstrap } from "./src/bootstrap.js";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(morgan("dev"));

bootstrap(app);
dbConnection();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
