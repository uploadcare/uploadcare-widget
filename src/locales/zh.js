
// #
// # Please, do not use this locale as a reference for new translations.
// # It could be outdated or incomplete. Always use the latest English versions:
// # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
// #
// # Any fixes are welcome.
// #
const translate = {
  uploading: '上传中...请等待',
  loadingInfo: '正在读取信息...',
  errors: {
    default: '错误',
    baddata: '错误数据',
    size: '文件太大',
    upload: '无法上传',
    user: '上传被取消',
    info: '无法读取信息',
    image: '只允许图形文件',
    createGroup: '无法建立文件组',
    deleted: '文件已被删除'
  },
  draghere: '拖放文件到这里',
  file: {
    other: '%1 个文件'
  },
  buttons: {
    cancel: '取消',
    remove: '删除'
  },
  dialog: {
    done: '完成',
    showFiles: '显示文件',
    tabs: {
      names: {
        url: '任意图片链接'
      },
      file: {
        drag: '拖放文件到这里',
        nodrop: '从你的电脑中上传',
        or: '或者',
        button: '从电脑中选取文件',
        also: '你也可以选自'
      },
      url: {
        title: '来自互联网的文件',
        line1: '从互联网选取文件',
        line2: '只需提供链接',
        input: '将链接拷贝至此...',
        button: '上传'
      },
      preview: {
        unknownName: '未知',
        change: '取消',
        back: '返回',
        done: '添加',
        unknown: {
          title: '上传中...请等待预览',
          done: '跳过预览，直接接受'
        },
        regular: {
          title: '添加这个文件?',
          line1: '你将添加上面的文件。',
          line2: '请确认。'
        },
        image: {
          title: '添加这个图片?',
          change: '取消'
        },
        crop: {
          title: '剪裁并添加这个图片',
          done: '完成'
        },
        error: {
          default: {
            title: '错误!',
            text: '上传过程中出错。',
            back: '请重试'
          },
          image: {
            title: '只允许上传图片文件。',
            text: '请选择其他文件重新上传。',
            back: '选择图片'
          },
          size: {
            title: '你选取的文件超过了100MB的上限',
            text: '请用另一个文件再试一次。'
          },
          loadImage: {
            title: '错误',
            text: '无法读取图片'
          }
        },
        multiple: {
          title: '你已经选择 %files%',
          question: '你要添加所有文件吗？',
          tooManyFiles: '你选了太多的文件. 最多可选择%max%. 请删除一些。',
          clear: '清空',
          done: '完成'
        }
      }
    }
  }
}

// Pluralization rules taken from:
// http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
const pluralize = function (n) {
  return 'other'
}

export { translate, pluralize }
