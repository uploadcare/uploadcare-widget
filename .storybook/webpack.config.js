const classPrefix = process.env.npm_package_config_classPrefix

module.exports = (storybookBaseConfig, configType) => {
  let storybookConfig = {...storybookBaseConfig}

  if (configType === 'PRODUCTION') {
    // see https://github.com/storybooks/storybook/issues/1570
    storybookConfig.plugins =
      [...storybookConfig.plugins.filter(plugin => plugin.constructor.name !== 'UglifyJsPlugin')]
  }

  return {
    ...storybookConfig,
    module: {
      rules: [
        ...storybookConfig.module.rules,
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: true,
                localIdentName: `${classPrefix}[local]`,
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                config: {
                  path: './scripts/postcss.config.js',
                }
              }
            }
          ]
        },
      ],
    },
  }
}
