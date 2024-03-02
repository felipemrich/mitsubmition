import express from "express";
import cors from "cors";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import dotenv from "dotenv"; // Importe o dotenv
import accountRoutes from "./routes/accountRoutes.js";

dotenv.config(); // Carregue as variáveis de ambiente

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swaggerDocument = YAML.parse(
  fs.readFileSync(join(__dirname, "swagger.yaml"), "utf8")
);

const app = express();
const port_server = process.env.PORT || 4000; // Porta configurável via variável de ambiente

app.use(express.static(join(__dirname, "build")));
app.use(cors());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/account", accountRoutes);
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "build", "index.html"));
});

app.listen(port_server, () => {
  console.log(`Running on port: ${port_server}`);
});
