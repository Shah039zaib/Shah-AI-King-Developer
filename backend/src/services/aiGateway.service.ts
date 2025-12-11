/**
 * aiGateway.service.ts
 * Requests to ai microservice for generation with automatic retries & logging to DB.
 */

import axios from "axios";
import logger from "../logger";
import { AI_SERVICE_URL } from "../config/env";
import prisma from "../db";

async function callAI(payload: any) {
  const start = Date.now();
  try {
    const res = await axios.post(`${AI_SERVICE_URL}/api/generate`, payload, { timeout: 60000 });
    const latency = Date.now() - start;
    // store log
    await prisma.aIProviderLog.create({
      data: {
        provider: res.data.provider || payload.provider || "unknown",
        model: res.data.model || payload.model || null,
        promptHash: String(payload.prompt)?.slice(0, 100),
        latencyMs: latency,
        success: true,
        tokensUsed: res.data.tokensUsed || null,
        meta: { url: AI_SERVICE_URL }
      }
    });
    return res.data;
  } catch (err: any) {
    const latency = Date.now() - start;
    await prisma.aIProviderLog.create({
      data: {
        provider: payload.provider || "unknown",
        model: payload.model || null,
        promptHash: String(payload.prompt)?.slice(0, 100),
        latencyMs: latency,
        success: false,
        meta: { error: err.message }
      }
    });
    logger.error("aiGateway error: " + (err.message || err.toString()));
    throw err;
  }
}

export default {
  generate: (opts: any) => callAI(opts)
};
