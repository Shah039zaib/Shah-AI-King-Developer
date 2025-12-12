// app.ts — express setup
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import authRoutes from "./modules/auth/auth.routes";
import customerRoutes from "./modules/customer/customer.routes";
import convRoutes from "./modules/conversation/conversation.routes";
import paymentRoutes from "./modules/payments/payments.routes";
import aiRoutes from "./modules/ai/ai.routes";
import adminRoutes from "./modules/admin/admin.routes";
import exportRoutes from "./modules/export/export.routes";
import whatsappRoutes from "./modules/whatsapp/whatsapp.routes";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const publicLimiter = rateLimit({ windowMs: 60*1000, max: 120 });
app.use(publicLimiter);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/conversations", convRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/exports", exportRoutes);
app.use("/api/webhooks/whatsapp", whatsappRoutes);

export default app;
