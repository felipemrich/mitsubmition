import express from "express";
import cors from "cors";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import dotenv from "dotenv";
import accountRoutes from "./routes/accountRoutes.js";

// Load environment variables from .env file
dotenv.config();

// Resolve directory name in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use fs and YAML to read and parse the YAML file
const swaggerDocument = YAML.parse(
  fs.readFileSync(join(__dirname, "swagger.yaml"), "utf8")
);

const app = express();
const port_server = process.env.PORT || 4000; // Default to port 3000 if not specified

// Adjust static middleware to serve from the correct path
app.use(express.static(join(__dirname, "build")));
app.use(cors());

// Serve Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Mount accountRoutes and handle static files
app.use("/account", accountRoutes);
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "build", "index.html")); // Adjusted path for consistency
});

app.listen(port_server, () => {
  console.log(`Running on port: ${port_server}`);
});
