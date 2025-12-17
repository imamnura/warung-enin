import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/ban-ts-comment": "off",
      "@next/next/no-img-element": "warn",
      "@typescript-eslint/triple-slash-reference": "off"
    },
    ignores: [
      "src/generated/**/*",
      "next-env.d.ts",
      ".next/**/*"
    ]
  }
];

export default eslintConfig;
