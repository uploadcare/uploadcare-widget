'use strict'

module.exports = {
  extends: 'stylelint-config-standard',
  rules: {
    'declaration-empty-line-before': ['always', {
      except: [
        'first-nested',
      ],
      ignore: [
        'after-comment',
        'after-declaration',
        'inside-single-line-block',
      ],
    }],
    'number-leading-zero': 'never',
  },
}
