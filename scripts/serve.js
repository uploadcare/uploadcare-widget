/* eslint no-console: off */
const ngrok = require('ngrok')
const browserSync = require('browser-sync')

const config = {
  port: 3219,
  server: './pkg/latest',
  files: './pkg/latest',
  directory: true,
  open: false,
}

browserSync(config, (error, bs) => {
  if (error) {
    throw new Error(error)
  }

  ngrok.connect(bs.options.get('port'), (error, url) => {
    if (error) {
      throw new Error(error)
    }

    console.log('Open in browser: ', url)
  })
})
