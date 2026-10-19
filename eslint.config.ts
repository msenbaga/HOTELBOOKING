import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      // You can add custom TypeScript/JS lint rules here if needed
    },
  },
];