// src/app.ts
import express from "express";
import bodyParser from "body-parser";
import { PORT } from "./config/env";
import logger from "./logger";
import providersRouter from "./providers/router";

const app = express();
app.use(bodyParser.json({ limit: "1mb" }));

// health
app.get("/health", (_req, res) => res.json({ ok: true, ts: Date.now() }));

// providers test route & unified generate proxy later
app.use("/providers", providersRouter);

export default app;
