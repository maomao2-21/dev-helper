import path, { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { defineConfig, loadEnv } from 'vite'

/** 配置项文档：https://vitejs.dev/config */
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    /** build 打包时根据实际情况修改 row */
    base: env.VITE_BASE,
    // runtimeCompiler: true,
    resolve: {
      alias: {
        /** @ 符号指向 src 目录 */
        '@': resolve(__dirname, './src'),
        $: resolve(__dirname, './site'),
        '~': resolve(__dirname, './src'),
        // vue: 'vue/dist/vue.esm-bundler.js',
      },
    },
    server: {
      /** 是否开启 https */
      https: false,
      /** host 设置为 true 才可以使用 network 的形式，以 ip 访问项目 */
      host: true, // host: "0.0.0.0"
      /** 端口号 */
      port: 3456,
      /** 是否自动打开浏览器 */
      open: false,
      /** 跨域设置允许 */
      cors: true,
      /** 端口被占用时，是否直接退出 */
      strictPort: false,
      /** 接口代理 */
      proxy: { 

        '/fe-dev': {
          target: 'http://localhost:18066',
          changeOrigin: true,
          logLevel: 'debug',
        },
       
      },
    },
    // css: {
    //   preprocessorOptions: {
    //     scss: {
    //       additionalData: `@import "./site/styles/variables.scss";`,
    //     },
    //   },
    // },
    build: {
      target: 'es2015',
      brotliSize: false,
      /** 消除打包大小超过 500kb 警告 */
      chunkSizeWarningLimit: 2000,
      /** vite 2.6.x 以上需要配置 minify: terser，terserOptions 才能生效 */
      minify: 'terser',
      /** 在 build 代码时移除 console.log、debugger 和 注释 */
      terserOptions: {
        compress: {
          drop_console: false,
          drop_debugger: true,
          // pure_funcs: ['console.log'],
        },
        output: {
          /** 删除注释 */
          comments: false,
        },
      },
      /** 打包后静态资源目录 */
      assetsDir: 'summerfarm-fe/static',
    },
    /** vite 插件 */
    plugins: [
      vue(),
      vueJsx(),
      legacy({
        targets: ['defaults', 'not IE 11'],
      }), 
    ],
  }
})
