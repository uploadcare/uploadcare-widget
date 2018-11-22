/* eslint-disable no-console */
import path from 'path'
import license from 'rollup-plugin-license'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import postcss from 'rollup-plugin-postcss'
import {sizeSnapshot} from 'rollup-plugin-size-snapshot'
import alias from 'rollup-plugin-alias'
import commonjs from 'rollup-plugin-commonjs'

const createConfig = ({output}) => ({
  input: 'src/index.js',
  output: output.map(format => Object.assign({name: 'UCWidget'}, format)),
  plugins: [
    alias({i18n: path.join(__dirname, 'src/i18n/index.js')}),
    replace({'process.env.NODE_ENV': process.env.NODE_ENV}),
    resolve({browser: true}),
    postcss({
      modules: true,
      plugins: [],
    }),
    babel(),
    commonjs({sourceMap: false}),
    license({
      banner: `
    <%= pkg.name %> <%= pkg.version %>
    <%= pkg.description %>
    <%= pkg.homepage %>
    Date: <%= moment().format('YYYY-MM-DD') %>
  `,
    }),
    sizeSnapshot(),
  ],
})

export default [
  createConfig({
    output: [
      {
        file: 'dist/uploadcare.esm.js',
        format: 'es',
      },
      {
        file: 'dist/uploadcare.cjs.js',
        format: 'cjs',
      },
      {
        file: 'dist/uploadcare.umd.js',
        format: 'umd',
      },
    ],
  }),
]
