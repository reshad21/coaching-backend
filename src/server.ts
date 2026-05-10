// import cors from "cors";
// import dotenv from "dotenv";
// import express from "express";
// import mainRouter from "./routes";

// dotenv.config();

// const app = express();

// app.set("trust proxy", 1);

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin) return callback(null, true);
//     if (origin.includes("localhost")) return callback(null, true);
//     if (origin.endsWith(".vercel.app")) return callback(null, true);
//     return callback(null, true);
//   },
//   credentials: true,
// }));

// app.use("/api", mainRouter);

// app.get("/", (req, res) => {
//   res.json({
//     success: true,
//     message: "Server running fine",
//   });
// });

// export default app;
import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({ ok: true });
});

export default app;