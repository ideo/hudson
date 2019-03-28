// next.config.js
const withSass = require('@zeit/next-sass')
const withOffline = require('next-offline')

const isProd = process.env.NODE_ENV === 'production';
module.exports = withOffline(
  withSass({
    /* any other next.js config goes here */
    publicRuntimeConfig: {
      BASE_API_URL: isProd ? 'http://172.31.75.13:1337' : 'http://localhost:1337' 
    },
    postcssLoaderOptions: { 
      parser: true, 
      autoprefixer: true 
    }
  })
)