// roman urdu comments included

import { execSync } from "child_process";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function autoBaseline() {
  console.log("🚀 Baseline checker running...");

  // db me tables check karo
  const tables: any[] = await prisma.$queryRaw`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public';
  `;

  const hasTables = tables.length > 0;

  // prisma migrations folder empty?
  const fs = require("fs");
  const migrationsExist = fs.existsSync("./prisma/migrations") &&
                          fs.readdirSync("./prisma/migrations").length > 0;

  console.log("📌 Tables exist:", hasTables);
  console.log("📌 Migrations exist:", migrationsExist);

  if (hasTables && !migrationsExist) {
    // auto baseline logic
    console.log("⚠️ Existing DB detected & no migrations found. Creating baseline...");

    execSync(
  "npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/0000_baseline/migration.sql",
  { stdio: "inherit", shell: "/bin/bash" } as any
);


    execSync(
  "npx prisma migrate resolve --applied 0000_baseline",
  { stdio: "inherit", shell: "/bin/bash" } as any
);


    console.log("✅ Baseline migration applied automatically.");
  } 
  else if (!hasTables) {
    console.log("🆕 Empty DB detected → Running full migrate");

    execSync("npx prisma migrate dev --name init", {
  stdio: "inherit",
  shell: "/bin/bash",
} as any);

  } 
  else {
    console.log("👌 Migrations directory already exists → Normal environment.");
  }

  process.exit(0);
}

autoBaseline().catch((err) => {
  console.error(err);
  process.exit(1);
});
