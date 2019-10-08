import babel from 'rollup-plugin-babel'
import jst from 'rollup-plugin-jst'

import json from 'rollup-plugin-json'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'

import serve from 'rollup-plugin-serve'

export default {
  input: 'src/build/uploadcare.full.js',

  output: {
    name: 'uploadcare',
    format: 'umd',
    file: 'dist/uploadcare.full.js'
  },

  watch: {
    clearScreen: false,
    include: 'src/**',
    exclude: 'src/(svgs|stylesheets)/**'
  },

  plugins: [
    babel({
      exclude: 'node_modules/**',
      presets: [['@babel/env', { modules: false }]]
    }),
    jst({
      templateOptions: {
        variable: 'ext'
      },

      escapeModule: 'escape-html'
    }),
    json(),

    resolve(),
    commonjs(),

    serve(['dummy', 'dist'])
  ]
}
