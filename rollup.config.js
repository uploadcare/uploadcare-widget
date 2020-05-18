import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import { string } from 'rollup-plugin-string'
import replacement from 'rollup-plugin-module-replacement'
import pkg from './package.json'

const banner = license => ({
  renderChunk(source) {
    return `
${license}

${source}`.trim()
  }
})

const bundle = (input, output, options = {}) => ({
  input: `src/bundles/${input}`,

  output: {
    name: 'uploadcare',
    format: 'umd',
    file: `${output}`,
    globals: options.includeJquery
      ? undefined
      : {
          jquery: '$'
        }
  },

  external: options.includeJquery ? undefined : ['jquery'],

  plugins: [
    options.enOnly &&
      replacement({
        entries: [
          {
            find: './all-locales',
            replacement: require.resolve('./src/locales/en-only-locale.js')
          }
        ]
      }),

    babel({
      exclude: 'node_modules/**',
      presets: [['@babel/env', { modules: false }]],
      plugins: ['babel-plugin-html-tag']
    }),

    string({
      include: ['src/stylesheets/styles.css', 'src/svgs/icons.html']
    }),
    json(),

    resolve(),
    commonjs({
      namedExports: { './src/vendor/pusher.js': ['Pusher'] }
    }),

    terser({
      include: [/^.+\.min\.js$/]
    }),
    banner(`/**
 * @license ${pkg.name} v${pkg.version}
 * 
 * Copyright (c) 2020 Uploadcare, Inc.
 * 
 * This source code is licensed under the BSD 2-Clause License 
 * found in the LICENSE file in the root directory of this source tree.
 */`)
  ]
})

export default [
  bundle('uploadcare.api.js', 'uploadcare.api.js', { enOnly: true }),
  bundle('uploadcare.api.js', 'uploadcare.api.min.js', { enOnly: true }),

  bundle('uploadcare.js', 'uploadcare.js'),
  bundle('uploadcare.js', 'uploadcare.min.js'),

  bundle('uploadcare.lang.en.js', 'uploadcare.lang.en.js', { enOnly: true }),
  bundle('uploadcare.lang.en.js', 'uploadcare.lang.en.min.js', {
    enOnly: true
  }),

  bundle('uploadcare.full.js', 'uploadcare.full.js', { includeJquery: true }),
  bundle('uploadcare.full.js', 'uploadcare.full.min.js', {
    includeJquery: true
  })
]
