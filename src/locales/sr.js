import uploadcare from '../namespace'

// #
// # Please, do not use this locale as a reference for new translations.
// # It could be outdated or incomplete. Always use the latest English versions:
// # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
// #
// # Any fixes are welcome.
// #
uploadcare.namespace('locale.translations', function (ns) {
  ns.sr = {
    uploading: 'Шаљем... Молимо сачекајте.',
    loadingInfo: 'Учитавам информације...',
    errors: {
      default: 'Грешка',
      baddata: 'Погрешна вредност',
      size: 'Фајл је сувише велик',
      upload: 'Не могу да пошаљем',
      user: 'Слање прекинуто',
      info: 'Не могу да учитам информације',
      image: 'Дозвољене су само слике',
      createGroup: 'Не могу да направим групу фајлова',
      deleted: 'Фајл је обрисан'
    },
    draghere: 'Убаците фајл овде',
    file: {
      one: '%1 фајл',
      other: '%1 фајлова'
    },
    buttons: {
      cancel: 'Поништи',
      remove: 'Избаци',
      choose: {
        files: {
          one: 'Изабери фајл',
          other: 'Изабери фајлове'
        },
        images: {
          one: 'Изабери слику',
          other: 'Изабери слике'
        }
      }
    },
    dialog: {
      close: 'Затвори',
      openMenu: 'Отвори мени',
      done: 'Готово',
      showFiles: 'Покажи фајлове',
      tabs: {
        names: {
          'empty-pubkey': 'Добродошли',
          preview: 'Погледај',
          file: 'Локални фајлови',
          url: 'Директан линк',
          camera: 'Камера',
          facebook: 'Фејсбук',
          dropbox: 'Dropbox',
          gdrive: 'Google Drive',
          gphotos: 'Google Photos',
          instagram: 'Инстаграм',
          vk: 'VK',
          evernote: 'Evernote',
          box: 'Box',
          onedrive: 'OneDrive',
          flickr: 'Flickr',
          huddle: 'Huddle'
        },
        file: {
          drag: 'превуци<br>било које фајлове',
          nodrop: 'Пошаљи фајлове са твог&nbsp;компјутера',
          cloudsTip: 'Клауд<br>и социјалне мреже',
          or: 'или',
          button: 'Изабери локални фајл',
          also: 'или изабери'
        },
        url: {
          title: 'Фајлове са Интернета',
          line1: 'Изабери било који фајл са Интернета.',
          line2: 'Само убаци линк.',
          input: 'Убаци линк овде...',
          button: 'Пошаљи'
        },
        camera: {
          title: 'Фајл са камере',
          capture: 'Усликај',
          mirror: 'Огледало',
          startRecord: 'Сними видео',
          stopRecord: 'Заустави',
          cancelRecord: 'Поништи',
          retry: 'Тражи дозволу поново',
          pleaseAllow: {
            title: 'Молимо вас да дозволите приступ вашој камери',
            text: 'Упитани сте да дозволите приступ вашој камери са овог сајта.<br>' + 'Уколико желите да сликате, морате одобрити овај захтев.'
          },
          notFound: {
            title: 'Камера није препозната',
            text: 'Изгледа да немате камеру на овом уређају.'
          }
        },
        preview: {
          unknownName: 'непознато',
          change: 'Поништи',
          back: 'Назад',
          done: 'Додај',
          unknown: {
            title: 'Шаљем... Сачекајте за приказ.',
            done: 'Прескочи приказ и прихвати'
          },
          regular: {
            title: 'Додај овај фајл?',
            line1: 'Управо ћете додати овај фајл изнад.',
            line2: 'Молимо потврдите.'
          },
          image: {
            title: 'Додај ову слику?',
            change: 'Поништи'
          },
          crop: {
            title: 'Кропуј и додај ову слику',
            done: 'Урађено',
            free: 'слободно'
          },
          video: {
            title: 'Додај овај видео?',
            change: 'Поништи'
          },
          error: {
            default: {
              title: 'Ооопс!',
              text: 'Нешто је искрсло у току слања.',
              back: 'Молимо покушајте поново'
            },
            image: {
              title: 'Дозвљене су само слике.',
              text: 'Молимо покушајте са другим фајлом.',
              back: 'Изабери слику'
            },
            size: {
              title: 'Фајл који сте изабрали премашује лимит.',
              text: 'Молимо покушајте са другим фајлом.'
            },
            loadImage: {
              title: 'Грешка',
              text: 'Не могу да учитам слику'
            }
          },
          multiple: {
            title: 'Изабрали сте %files%.',
            question: 'Додај %files%?',
            tooManyFiles: 'Изабрали сте превише фајлова. %max% је максимално.',
            tooFewFiles: 'Изабрали сте %files%. Морате најмање %min% фајла.',
            clear: 'Избаци све',
            done: 'Додај',
            file: {
              preview: 'Прегледај %file%',
              remove: 'Избаци %file%'
            }
          }
        }
      },
      footer: {
        text: 'направио',
        link: 'uploadcare'
      }
    }
  }
})

// Pluralization rules taken from:
// http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
uploadcare.namespace('locale.pluralize', function (ns) {
  ns.sr = function (n) {
    if (n === 1) {
      return 'one'
    }
    return 'other'
  }
})
