import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import boundaries from "eslint-plugin-boundaries";

export default tseslint.config(
  { ignores: ["dist", "node_modules", "supabase/functions", "coverage"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "boundaries": boundaries,
    },
    settings: {
      // Define architectural layers for boundaries plugin
      "boundaries/elements": [
        { type: "pages", pattern: "src/pages/*" },
        { type: "components", pattern: "src/components/*" },
        { type: "hooks", pattern: "src/hooks/*" },
        { type: "lib", pattern: "src/lib/*" },
        { type: "context", pattern: "src/context/*" },
        { type: "integrations", pattern: "src/integrations/*" },
      ],
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "off",
      // Enforce file size limits to prevent monolithic components
      "max-lines": ["warn", { max: 500, skipBlankLines: true, skipComments: true }],
      // Encourage smaller functions
      "max-lines-per-function": ["warn", { max: 100, skipBlankLines: true, skipComments: true }],
      // Architectural boundary rules - prevent improper imports
      "boundaries/element-types": [
        "error",
        {
          // Allow lib to be imported by anyone
          // Allow integrations to be imported by anyone
          // Prevent hooks from importing pages (hooks should be reusable)
          // Prevent components from importing pages (components should be reusable)
          default: "disallow",
          rules: [
            // pages can import anything except other pages
            { from: "pages", allow: ["components", "hooks", "lib", "context", "integrations"] },
            // components can import hooks, lib, context, other components, integrations
            { from: "components", allow: ["components", "hooks", "lib", "context", "integrations"] },
            // hooks can import lib, context, other hooks, integrations
            { from: "hooks", allow: ["hooks", "lib", "context", "integrations"] },
            // lib can only import other lib
            { from: "lib", allow: ["lib"] },
            // context can import hooks, lib
            { from: "context", allow: ["context", "hooks", "lib", "integrations"] },
            // integrations can import lib
            { from: "integrations", allow: ["lib", "integrations"] },
          ],
        },
      ],
    },
  }
);

