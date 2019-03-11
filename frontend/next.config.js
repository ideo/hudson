// next.config.js
const withSass = require('@zeit/next-sass')
const isProd = process.env.NODE_ENV === 'production';
module.exports = withSass({
  /* any other next.js config goes here */
  publicRuntimeConfig: {
    BASE_API_URL: isProd ? '' : 'http://localhost:1337' 
  }
})