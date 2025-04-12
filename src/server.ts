import dotenv from "dotenv";

dotenv.config();
import express from "express";
import { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { Response, Request } from "express";
import routes from "./routes";
import "./controllers/middleware/passport";

const app: Application = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", routes);


app.get("/", (req, res) => {
  res.json({ message: "Welcome to the app!" });
});

app.use((err: Error, req: Request, res: Response) => {
  console.error("Express error:", err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});


export default app;
