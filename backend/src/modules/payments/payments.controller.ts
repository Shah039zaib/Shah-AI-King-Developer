import { Request, Response } from "express";
import paymentService from "../../services/payment.service";
import prisma from "../../db";

/**
 * Payments controller: create + webhook + get QR
 */

export async function createPayment(req: any, res: Response) {
  try {
    const { amount, method } = req.body;
    const payment = await paymentService.createPayment(req.user.id, Number(amount), method);
    res.json({ ok: true, payment });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function webhook(req: Request, res: Response) {
  // validate based on provider — placeholder
  const provider = req.params.provider;
  // TODO: verify signature
  const body = req.body;
  // update payment by provider reference
  // example: find by metadata.ref
  // here we accept minimal flow
  res.json({ ok: true, provider, received: true });
}

export async function getPaymentQR(req: any, res: Response) {
  const { paymentId } = req.params;
  const p = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!p) return res.status(404).json({ error: "Payment not found" });
  // generate simple QR payload (signed)
  const jwt = require("jsonwebtoken");
  const token = jwt.sign({ pid: paymentId }, process.env.PAYMENT_QR_SECRET || "change_me", { expiresIn: "1h" });
  const url = `${req.protocol}://${req.get("host")}/api/payments/confirm?token=${token}`;
  // return url (frontend can generate QR image)
  res.json({ ok: true, url });
}
