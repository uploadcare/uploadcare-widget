'use strict'

module.exports = {
  extends: 'stylelint-config-uploadcare',
  rules: {
    'block-no-empty': 'off',
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
  },
}
