import { execSync } from "node:child_process";

export default async function () {
  execSync(
    "dotenv -e .env.test -- prisma migrate reset --force",
    {
      stdio: "inherit",
    },
  );
}