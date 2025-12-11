// src/index.ts
import http from "http";
import app from "./app";
import { PORT } from "./config/env";
import logger from "./logger";

const server = http.createServer(app);

server.listen(PORT, () => {
  logger.info(`AI microservice listening on port ${PORT}`);
});
