import license from 'rollup-plugin-license'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import postcss from 'rollup-plugin-postcss'
import {sizeSnapshot} from 'rollup-plugin-size-snapshot'

const getPlugins = () =>
  [
    replace({'process.env.NODE_ENV': process.env.NODE_ENV}),
    resolve({jsnext: true}),
    commonjs({
      include: 'node_modules/**',
      sourceMap: false,
    }),
    postcss({
      modules: true,
      plugins: [],
    }),
    babel(),
    license({
      banner: `
      <%= pkg.name %> <%= pkg.version %>
      <%= pkg.description %>
      <%= pkg.homepage %>
      Date: <%= moment().format('YYYY-MM-DD') %>
    `,
    }),
    sizeSnapshot(),
  ].filter(plugin => !!plugin)

export default [
  {
    input: 'src/index.js',
    plugins: getPlugins(),
    output: [
      {
        file: 'dist/uploadcare-widget.esm.js',
        format: 'es',
      },
    ],
  },
]
