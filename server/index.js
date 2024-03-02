import express from "express";
import cors from "cors";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import accountRoutes from "./routes/accountRoutes.js";
import { connectDB } from "./dal.js";

// Resolve directory name in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use fs and YAML to read and parse the YAML file
const swaggerDocument = YAML.parse(
  fs.readFileSync(join(__dirname, "swagger.yaml"), "utf8")
);

const app = express();
const port_server = process.env.PORT || 4000; // Default port to 4000 if PORT env var is not set

// CORS options - Adjust the origin as per your requirement
const corsOptions = {
  origin: "https://walrus-app-cb2fc.ondigitalocean.app", // Replace with your front-end app's origin
};

app.use(cors(corsOptions)); // Use CORS with the specified options
app.use(express.static(join(__dirname, "build"))); // Adjust static middleware to serve from the build path

// Serve Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API routes
app.use("/account", accountRoutes);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Fallback route for SPA - Serve index.html for any unhandled routes
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "build", "index.html")); // Ensure this path points to your build output directory
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Connect to MongoDB and start the server
connectDB().then(() => {
  app.listen(port_server, () => {
    console.log(`Running on port: ${port_server}`);
  });
});
