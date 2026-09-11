import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import legalRequestRoutes from "./routes/legalRequestRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static(
    path.join(process.cwd(), "uploads"),
  ),
);

app.use(
  "/api/legal-requests",
  legalRequestRoutes,
);

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Legal Intake Portal backend is running",
    port: PORT,
  });
});

app.listen(PORT, () => {
  console.log(
    `Backend server running on http://localhost:${PORT}`,
  );
});