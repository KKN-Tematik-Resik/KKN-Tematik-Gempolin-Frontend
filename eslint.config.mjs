import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { defineConfig, globalIgnores } from "eslint/config";

// Custom rule: dilarang "use client" di layout.tsx dan page.tsx.
// Server Components (layout/page) tidak boleh jadi Client Component
// karena akan merusak streaming dan memperlambat navigasi.
// Ref: docs/superpowers/specs/03-code-guideline-and-best-practices.md §2.A, Anti-Pattern #2
const noUseClientInLayoutOrPage = {
  meta: { type: "problem", messages: { forbidden: "\"use client\" dilarang di file {{file}}. Pindahkan logika interaktif ke komponen daun (leaf client component) yang diimpor di sini." } },
  create(context) {
    const filename = context.getFilename?.() ?? context.filename ?? "";
    const isLayoutOrPage = /(?:^|[\\/])(layout|page)\.[jt]sx?$/.test(filename);
    if (!isLayoutOrPage) return {};
    return {
      ExpressionStatement(node) {
        if (
          node.expression.type === "Literal" &&
          node.expression.value === "use client" &&
          node.parent?.type === "Program" &&
          node.parent.body[0] === node
        ) {
          context.report({ node, messageId: "forbidden", data: { file: filename.split(/[\\/]/).pop() } });
        }
      },
    };
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    ".agents/**",
    "public/**",
    "docs/**",
    "src/legacy-demo/**",
  ]),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      ".agents/**",
      "public/**",
      "docs/**",
      "src/legacy-demo/**",
    ],
    plugins: {
      local: { rules: { "no-use-client-in-layout-or-page": noUseClientInLayoutOrPage } },
    },
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "local/no-use-client-in-layout-or-page": "error",
    },
  },
]);

export default eslintConfig;
