/**
 * Updated Payments Controller — Manual Payments Only
 * Roman Urdu comments:
 * - User payment start karta hai => system instructions AI ko deta hai
 * - User screenshot bhejta hai => DB me save hota hai
 * - Admin verification karta hai
 */

import { Request, Response } from "express";
import paymentService from "../../services/payment.service";
import prisma from "../../db";

export async function createPayment(req: any, res: Response) {
  try {
    const { amount, method } = req.body;

    const { payment, instructions } = await paymentService.createManualPayment(
      req.user.id,
      Number(amount),
      method
    );

    res.json({
      ok: true,
      payment,
      instructions  // AI ko yeh bhejna hota hai
    });

  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

// Screenshot upload handler
export async function uploadScreenshot(req: any, res: Response) {
  const { paymentId, url } = req.body;
  const updated = await paymentService.savePaymentScreenshot(paymentId, url);
  res.json({ ok: true, payment: updated });
}

// Admin verifies payment
export async function verify(req: any, res: Response) {
  const { paymentId, status } = req.body;
  const updated = await paymentService.verifyPayment(paymentId, status);
  res.json({ ok: true, payment: updated });
}
