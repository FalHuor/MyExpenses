import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "integration",
          include: [
            "src/tests/integration/**/*.test.ts",
          ],
          globals: true,
          setupFiles: [
            "./src/tests/integration/setup.ts",
          ],
          globalSetup: [
            "./src/tests/integration/globalSetup.ts",
          ],
          fileParallelism: false,
        },
      }, {
        test: {
          name: "unit",
          include: ["src/tests/unit/**/*.test.ts"],
          environment: "node",
        }
      }
    ]
  },
});