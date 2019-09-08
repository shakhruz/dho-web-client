// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js
require('dotenv').config()

module.exports = function (ctx) {
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    boot: [
      'stream'
    ],

    css: [
      'app.styl'
    ],

    extras: [
      // 'ionicons-v4',
      // 'mdi-v3',
      'fontawesome-v5',
      // 'eva-icons',
      // 'themify',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      'material-icons' // optional, you are not bound to it
    ],

    framework: {
      // iconSet: 'ionicons-v4',
      // lang: 'de', // Quasar language

      // all: true, // --- includes everything; for dev only!

      components: [
        'QAvatar',
        'QBadge',
        'QBanner',
        'QBtn',
        'QBtnGroup',
        'QCard',
        'QCardActions',
        'QCardSection',
        'QCheckbox',
        'QDialog',
        'QDrawer',
        'QExpansionItem',
        'QFooter',
        'QForm',
        'QHeader',
        'QIcon',
        'QInput',
        'QItem',
        'QItemSection',
        'QItemLabel',
        'QKnob',
        'QLayout',
        'QList',
        'QPage',
        'QPageContainer',
        'QRouteTab',
        'QSelect',
        'QSeparator',
        'QStep',
        'QStepper',
        'QStepperNavigation',
        'QTable',
        'QTabs',
        'QTimeline',
        'QTimelineEntry',
        'QToolbar',
        'QToolbarTitle'
      ],

      directives: [
        'Ripple'
      ],

      // Quasar plugins
      plugins: [
        'Notify',
        'LocalStorage'
      ]
    },

    supportIE: false,

    build: {
      env: {
        WEBSERVICE: process.env.WEBSERVICE,
        STREAM_KEY: process.env.STREAM_KEY,
        STREAM_APP_ID: process.env.STREAM_APP_ID,
        STREAM_FEED_TOKEN_MEMBERS: process.env.STREAM_FEED_TOKEN_MEMBERS,
        STREAM_FEED_TOKEN_PROPOSALS: process.env.STREAM_FEED_TOKEN_PROPOSALS,
        STREAM_FEED_TOKEN_ROLES: process.env.STREAM_FEED_TOKEN_ROLES
      },
      scopeHoisting: true,
      // vueRouterMode: 'history',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
          options: {
            formatter: require('eslint').CLIEngine.getFormatter('stylish')
          }
        })

        cfg.module.rules.push({
          test: /\.pug$/,
          loader: 'pug-plain-loader'
        })
      }
    },

    devServer: {
      // https: true,
      // port: 8080,
      open: true // opens browser window automatically
    },

    // animations: 'all', // --- includes all animations
    animations: [],

    ssr: {
      pwa: false
    },

    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {}, // only for NON InjectManifest
      manifest: {
        // name: 'HyphaDAC Mobile Dapp',
        // short_name: 'HyphaDAC Mobile Dapp',
        // description: 'HyphaDAC Mobile Dapp',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },

    cordova: {
      // id: 'org.cordova.quasar.app',
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    electron: {
      // bundler: 'builder', // or 'packager'

      extendWebpack (cfg) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      },

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        // appId: 'hyphadac-quasar'
      }
    }
  }
}
