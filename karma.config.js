const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const replace = require('rollup-plugin-replace')

process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = function(config) {
  config.set({
    browsers: ['ChromeHeadless'],
    frameworks: ['jasmine'],

    files: [
      {
        pattern: 'src/**/*.spec.js',
        watched: false,
      },
    ],

    plugins: ['karma-chrome-launcher', 'karma-jasmine', 'karma-rollup-preprocessor'],

    preprocessors: {'src/**/*.spec.js': ['rollup']},
    rollupPreprocessor: {
      plugins: [
        replace({'process.env.NODE_ENV': process.env.NODE_ENV}),
        resolve({jsnext: true}),
        commonjs({
          include: 'node_modules/**',
          sourceMap: false,
        }),
        babel(),
      ],
      output: {
        format: 'iife',
        name: 'uploadcare',
        sourcemap: 'inline',
      },
    },

    client: {jasmine: {}},
  })
}
