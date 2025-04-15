import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mainRouter from "./routes";
import notFound from "./utils/notFound";
import { globalErrorHandler } from "./middleware/golobalErrorHandler";
import AppError from "./errors/AppError";
import path from "path"; // Import path module
import { fileURLToPath } from "url"; // Import for ES Modules compatibility
import { seedUser } from "./SeedUser/seedUser";


dotenv.config();
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

dotenv.config({ path: envFile });

const envName =
  process.env.NODE_ENV === "production" ? "production" : "development";

const port = process.env.PORT!;
const corsOrigin = process.env.CORS_ORIGIN!;

const app = express();

// Get the directory name equivalent to __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'public' directory at the root level
app.use("/images", express.static(path.join(__dirname, "../public/images")));
app.use("/file", express.static(path.join(__dirname, "../public/file")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: string | boolean) => void
  ) => {
    if (!origin || corsOrigin.split(",").includes(origin)) {
      callback(null, origin);
    } else {
      callback(new AppError(301, `Origin: ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use("/api/", mainRouter);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: `Coaching_Management_backend ${port}`,
  });
});

// Not Found
app.use(notFound);

// Global error handler
app.use(globalErrorHandler);

app.listen(port, () => {
  seedUser();
  console.log(`${envName} Server is running on http://localhost:${port}`);
});
