import express from "express";
import cors from "cors";
import { createServer } from "http";
const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});
const httpServer = createServer(app);
const PORT = 3005;
httpServer.listen(PORT, () => {
  console.log(`Chat App server running on http://localhost:${PORT} `);
});
