import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  // ⚠️ globalIgnores 必须放在最前(eslint 9 flat config 规则)
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // OpenNext Cloudflare build output(打包产物,不 lint)
    ".open-next/**",
    // wrangler dev 临时产物
    ".wrangler/**",
    ".dev.vars",
  ]),
  ...nextVitals,
  ...nextTs,
]);

export default eslintConfig;
