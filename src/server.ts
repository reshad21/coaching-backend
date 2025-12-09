import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mainRouter from "./routes";
import notFound from "./utils/notFound";
import { globalErrorHandler } from "./middleware/golobalErrorHandler";
import AppError from "./errors/AppError";
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


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const allowedOrigins = [
  "https://coaching-management.vercel.app",
  "http://localhost:5173", // Optional: if you want local dev too
];
// CORS configuration
// const corsOptions = {
//   origin: (
//     origin: string | undefined,
//     callback: (err: Error | null, allow?: string | boolean) => void
//   ) => {
//     if (!origin || corsOrigin.split(",").includes(origin)) {
//       callback(null, origin);
//     } else {
//       callback(new AppError(301, `Origin: ${origin} not allowed by CORS`));
//     }
//   },
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };
const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error( origin);
      callback(new AppError(403, `Origin ${origin} not allowed by CORS`));
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
    message: `🎯 Coaching Backend Server is running on ${envName} environment (Port: ${port})`,
    environment: envName,
    timestamp: new Date().toISOString(),
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
