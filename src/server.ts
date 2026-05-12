import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mainRouter from "./routes";

dotenv.config();

const app = express();

app.set("trust proxy", 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (origin.includes("localhost")) return callback(null, true);
      if (origin.endsWith(".vercel.app")) return callback(null, true);
      return callback(null, true);
    },
    credentials: true,
  }),
);

app.use("/api", mainRouter);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server running fine",
  });
});

app.get("/api/health/sms", (req, res) => {
  const hasApiKey = !!process.env.API_KEY;
  const hasSenderId = !!process.env.SENDER_ID;

  res.json({
    success: true,
    smsConfigured: hasApiKey && hasSenderId,
    hasApiKey,
    hasSenderId,
    apiKeyLength: hasApiKey ? process.env.API_KEY!.length : 0,
    senderIdValue: hasSenderId ? process.env.SENDER_ID : null,
    environment: process.env.NODE_ENV,
  });
});

export default app;
