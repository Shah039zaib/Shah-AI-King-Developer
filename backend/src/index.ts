// index.ts — server start
import http from "http";
import "./../scripts/prisma-baseline"; // auto baseline
import app from "./app";
import { PORT } from "./config/env";
import initSockets from "./sockets";

const server = http.createServer(app);
initSockets(server);

server.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
