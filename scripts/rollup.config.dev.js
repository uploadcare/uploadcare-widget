import babel from 'rollup-plugin-babel'
import { string } from 'rollup-plugin-string'
import json from 'rollup-plugin-json'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'

import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

export default {
  input: 'src/bundles/uploadcare.full.js',

  output: {
    name: 'uploadcare',
    format: 'umd',
    file: 'dist/uploadcare.full.js',
    sourcemap: 'inline'
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
    string({
      include: ['src/stylesheets/styles.css', 'src/svgs/icons.html']
    }),
    json(),

    resolve(),
    commonjs({
      namedExports: { './src/vendor/pusher.js': ['Pusher'] }
    }),

    serve(['dummy', 'dist']),
    livereload({ watch: ['dummy', 'dist'] })
  ]
}
