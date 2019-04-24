// next.config.js
const withSass = require('@zeit/next-sass')
const withOffline = require('next-offline')

const isProd = process.env.NODE_ENV === 'production';
module.exports = withOffline(
  withSass({
    /* any other next.js config goes here */
    publicRuntimeConfig: {
      BASE_API_URL: isProd ? 'http://ec2-34-225-188-146.compute-1.amazonaws.com:1337' : 'http://localhost:1337' 
    },
    postcssLoaderOptions: { 
      parser: true, 
      autoprefixer: true 
    }
  })
) 