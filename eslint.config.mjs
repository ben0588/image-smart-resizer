// 引入 Next.js 的 Flat Config 設定 (避開 FlatCompat 的地雷)
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
// 引入 Prettier
import prettierConfig from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  // 設定忽略清單 (使用標準物件語法，不要用 helper)
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "node_modules/**",
    ],
  },

  // 展開 Next.js 的核心規則 (這是一個陣列，所以要用 ... 展開)
  ...nextVitals,

  // 展開 TypeScript 規則
  ...nextTs,

  // 最後放入 Prettier 規則來覆蓋衝突
  prettierConfig,
];

export default eslintConfig;
