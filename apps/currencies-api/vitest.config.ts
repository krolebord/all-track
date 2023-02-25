import path from 'path'
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "miniflare",
    includeSource: ['**/*.{js,ts}'],
    alias: {
      '~/*': path.resolve(__dirname, './src')
    }
  },
})
