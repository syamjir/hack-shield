import type { Config } from "jest";
import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",

  transform: {
    ...tsJestTransformCfg,
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  // ✅ FIX FOR @/ ALIAS
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};

export default config;
