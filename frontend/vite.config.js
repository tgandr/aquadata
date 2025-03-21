import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // babel: {
      //   plugins: [
      //     ["@babel/plugin-proposal-decorators", { "legacy": true }],
      //     ["@babel/plugin-transform-class-properties", {"loose": true}],
      //     ["@babel/plugin-transform-runtime"]
      //   ]
      // }
    }),
    nodePolyfills()
  ]
})
