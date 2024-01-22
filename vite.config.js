import { resolve } from 'node:path'
import { cwd } from 'node:process'

import { defineConfig } from 'vite'
import unocss from 'unocss/vite'
import vue from '@vitejs/plugin-vue'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const config = {
    base: './',
    resolve: {
      alias: {
        '@': resolve(cwd(), './src/'),
      },
    },
  }

  const plugins = [
    vue(),
    unocss(),
  ]

  if (mode === 'development') {
    plugins.push(mkcert())
    config.server = {
      host: '0.0.0.0',
      https: true,
    }
  }

  return {
    ...config,
    plugins,
  }
})
