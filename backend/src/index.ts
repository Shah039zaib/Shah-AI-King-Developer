// index.ts — server start
import http from "http";
import app from "./app";
import { PORT } from "./config/env";
import initSockets from "./sockets";

const server = http.createServer(app);
initSockets(server);

server.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
