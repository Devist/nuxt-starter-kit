require('dotenv').config()

module.exports = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['@/assets/scss/main.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['@/plugins/axios', '@/plugins/api-accessor', '@/plugins/cypress'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxt/typescript-build', '@nuxtjs/tailwindcss'],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://buefy.github.io/#/documentation
    'nuxt-buefy',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    // 성능 최적화(파일 크기 줄이기) 때 사용
    'nuxt-purgecss'
  ],
  purgeCSS: {
    enabled: false
  },
  // 성능 최적화(파일 크기 줄이기) 때 사용
  // purgeCSS: {
  //   mode: 'postcss',
  //   enabled: process.env.NODE_ENV === 'production',
  //   paths: [
  //     'components/**/*.vue',
  //     'layouts/**/*.vue',
  //     'pages/**/*.vue',
  //     'plugins/**/*.js'
  //   ],
  //   styleExtensions: ['.css'],
  //   whitelist: ['body', 'html', 'nuxt-progress'],
  //   whitelistPatterns: [/^b-/],
  //   whitelistPatternsChildren: [/^tabs/, /^is-/, /^b-/, /^navbar/],
  //   extractors: [
  //     {
  //       extractor: (content) => content.match(/[A-z0-9-:\\/]+/g) || [],
  //       extensions: ['html', 'vue', 'js']
  //     }
  //   ]
  // },

  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    proxy: true
  },
  // 미들웨어에 접근인증을 위해 추가
  router: {
    middleware: 'auth'
  },
  proxy: {
    '/albums': {
      target: 'https://jsonplaceholder.typicode.com/',
      secure: false,
      changeOrigin: true
    }
  },
  dotenv: {
    filename:
      process.env.NODE_ENV === 'production'
        ? '.env'
        : '.env.' + process.env.NODE_ENV
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(_config, _ctx) {}
  }
}
