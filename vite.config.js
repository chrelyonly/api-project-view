import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({

  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    AutoImport({
      resolvers: [
        ElementPlusResolver(),
      ],
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    https: {
      key: './key.pem',
      cert: './cert.pem',
    },
    // port: 2888,
    proxy: {
      '/api/': {
        // target: 'http://127.0.0.1:8077',
        target: 'https://api-project.frp.chrelyonly.cn/api/',
        changeOrigin: true,
        ws: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
  esbuild: {
    drop: ['console', 'debugger']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const modules = ['element-plus', 'vue', 'vue-router', 'pinia'];
            const chunkName = modules.find(m => id.includes(m));
            return chunkName ? chunkName : 'vendor';
          }
        }
      },
    },
    terserOptions: {
      compress: {
        // 开启压缩
        drop_console: true, // 移除console
        drop_debugger: true, // 移除debugger
      },
      sourceMap: false,
      mangle: {
        // 开启变量名混淆
        toplevel: true,
      },
    },
  },
})
