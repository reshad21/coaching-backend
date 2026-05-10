import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mainRouter from "./routes";

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

dotenv.config({ path: envFile });

const envName =
  process.env.NODE_ENV === "production"
    ? "production"
    : "development";

const port = process.env.PORT!;

const app = express();

app.set("trust proxy", 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  "https://coachingdevelopfrontend.vercel.app",
  "http://localhost:5173",
];


// HERE WE LOG THE ORIGIN OF EACH INCOMING REQUEST TO HELP DEBUG CORS ISSUES
app.use((req, res, next) => {
  console.log(req.headers.origin);
  next();
});

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Origin:", origin);

      if (!origin) {
        return callback(null, true);
      }

      // localhost
      if (origin.includes("localhost")) {
        return callback(null, true);
      }

      // allow all vercel domains
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      // manual allow list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked"));
    },

    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

app.use("/api", mainRouter);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: `🎯 Coaching Backend Server is running on ${envName} environment (Port: ${port})`,
    environment: envName,
    timestamp: new Date().toISOString(),
  });
});

export default app;