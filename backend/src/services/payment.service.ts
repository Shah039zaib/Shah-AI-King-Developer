/**
 * Payment.service — stores payment records and returns instructions
 * Integrate actual provider SDKs here.
 */

import prisma from "../db";
import logger from "../logger";

class PaymentService {
  async createPayment(userId: string, amount: number, method: string) {
    const p = await prisma.payment.create({
      data: {
        userId,
        amount,
        method,
        status: "PENDING",
        metadata: {}
      }
    });
    // placeholder: return provider instructions
    const instructions = this.getInstructionsForMethod(method, p.id);
    return { ...p, instructions };
  }

  getInstructionsForMethod(method: string, paymentId: string) {
    // Example placeholders for EasyPaisa/JazzCash
    if (method === "easypaisa") {
      return { type: "easypaisa", number: "0300-XXXXXXX", reference: paymentId };
    }
    if (method === "jazzcash") {
      return { type: "jazzcash", number: "0321-XXXXXXX", reference: paymentId };
    }
    return { type: "bank_transfer", account: "123456789", reference: paymentId };
  }

  async confirmPayment(paymentId: string, status: string, meta?: any) {
    const p = await prisma.payment.update({ where: { id: paymentId }, data: { status, metadata: meta || {} } });
    logger.info(`Payment ${paymentId} updated to ${status}`);
    return p;
  }
}

export default new PaymentService();
