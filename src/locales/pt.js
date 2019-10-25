// #
// # Please, do not use this locale as a reference for new translations.
// # It could be outdated or incomplete. Always use the latest English versions:
// # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
// #
// # Any fixes are welcome.
// #
const translations = {
  uploading: 'Fazendo upload... Aguarde.',
  loadingInfo: 'Carregando informações...',
  errors: {
    default: 'Erro',
    baddata: 'Valor incorreto',
    size: 'Arquivo muito grande',
    upload: 'Não foi possível fazer o upload',
    user: 'Upload cancelado',
    info: 'Não foi possível carregar as informações',
    image: 'Apenas imagens são permitidas',
    createGroup: 'Não foi possível criar o grupo de arquivos',
    deleted: 'O arquivo foi excluído'
  },
  draghere: 'Arraste um arquivo aqui',
  file: {
    one: '%1 arquivo',
    other: '%1 arquivos'
  },
  buttons: {
    cancel: 'Cancelar',
    remove: 'Excluir',
    choose: {
      files: {
        one: 'Escolha um arquivo',
        other: 'Escolha arquivos'
      },
      images: {
        one: 'Escolha uma imagem',
        other: 'Escolha imagens'
      }
    }
  },
  dialog: {
    done: 'OK',
    showFiles: 'Mostrar arquivos',
    tabs: {
      names: {
        preview: 'Pré-estréia',
        file: 'Computador',
        url: 'Link da web'
      },
      file: {
        drag: 'Arraste um arquivo aqui',
        nodrop: 'Faça upload de arquivos do seu computador',
        or: 'ou',
        button: 'Escolha um arquivo do computador',
        also: 'Você também pode escolher arquivos de'
      },
      url: {
        title: 'Arquivos da web',
        line1: 'Faça upload de qualquer arquivo da web.',
        line2: 'Apenas informe o link.',
        input: 'Cole seu link aqui...',
        button: 'Upload'
      },
      camera: {
        capture: 'Tirar uma foto',
        mirror: 'Espelhar',
        startRecord: 'Gravar um vídeo',
        stopRecord: 'Parar',
        cancelRecord: 'Cancelar',
        retry: 'Requisitar permissão novamente',
        pleaseAllow: {
          title: 'Por favor permita o acesso a sua câmera',
          text:
            'Você foi solicitado a permitir o acesso à câmera a partir deste site. ' +
            'Para tirar fotos com sua câmera, você deve aprovar este pedido.'
        },
        notFoud: {
          title: 'Câmera não detectada',
          text:
            'Parece que você não tem uma câmera conectada a este dispositivo'
        }
      },
      preview: {
        unknownName: 'desconhecido',
        change: 'Cancelar',
        back: 'Voltar',
        done: 'Adicionar',
        unknown: {
          title: 'Fazendo upload... Aguarde a visualização.',
          done: 'Pular visualização e aceitar'
        },
        regular: {
          title: 'Adicionar esse arquivo?',
          line1: 'Você está prestes a adicionar o arquivo acima.',
          line2: 'Por favor, confirme.'
        },
        image: {
          title: 'Adicionar essa imagem?',
          change: 'Cancelar'
        },
        crop: {
          title: 'Cortar e adicionar essa imagem',
          done: 'OK',
          free: 'livre'
        },
        error: {
          default: {
            title: 'Oops!',
            text: 'Alguma coisa deu errado durante o upload.',
            back: 'Por favor, tente novamente'
          },
          image: {
            title: 'Apenas arquivos de imagem são aceitos.',
            text: 'Por favor, tente novamente com outro arquivo.',
            back: 'Escolher a imagem'
          },
          size: {
            title: 'O arquivo que você escolheu excede o limite.',
            text: 'Por favor, tente novamente com outro arquivo.'
          },
          loadImage: {
            title: 'Erro',
            text: 'Não foi possível carregar a imagem'
          }
        },
        multiple: {
          title: 'Você escolheu',
          question: 'Você quer adicionar todos esses arquivos?',
          clear: 'Excluir todos',
          done: 'OK'
        }
      }
    }
  }
}

// Pluralization rules taken from:
// http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
const pluralize = function(n) {
  if (n === 1) {
    return 'one'
  }
  return 'other'
}

export default { translations, pluralize }
