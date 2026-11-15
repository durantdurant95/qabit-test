import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

// Some MSW dependencies are published as ESM only, so they must be transformed.
const esmPackages = ["rettime", "until-async", "@open-draft/deferred-promise"];

// pnpm stores scoped packages as `.pnpm/@scope+name@version`.
const esmPattern = esmPackages
  .map((name) => name.replace("/", "[+/]"))
  .join("|");

const config: Config = {
  testEnvironment: "jest-fixed-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
};

export default async function jestConfig(): Promise<Config> {
  const nextConfig = await createJestConfig(config)();

  return {
    ...nextConfig,
    transformIgnorePatterns: [
      `/node_modules/(?!(\\.pnpm/)?(${esmPattern})[@/])`,
      "^.+\\.module\\.(css|sass|scss)$",
    ],
  };
}
