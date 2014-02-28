# Note: English locale is the default and used as a fallback.
uploadcare.namespace 'uploadcare.locale.translations', (ns) ->
  ns.pt =
    uploading: 'Fazendo upload... Aguarde.'
    loadingInfo: 'Carregando informações...'
    errors: 
      default: 'Erro'
      baddata: 'Valor incorreto'
      size: 'Arquivo muito grande'
      upload: 'Não foi possível fazer o upload'
      user: 'Upload cancelado'
      info: 'Não foi possível carregar as informações'
      image: 'Apenas imagens são permitidas'
      createGroup: 'Não foi possível criar o grupo de arquivos'
      deleted: 'O arquivo foi excluído'
    draghere: 'Arraste um arquivo para cá'
    file: 
      one: '%1 arquivo'
      other: '%1 arquivos'
    buttons: 
      cancel: 'Cancelar'
      remove: 'Excluir'
    dialog:
      done: 'OK'
      showFiles: 'Mostrar arquivos'
      tabs:
        names:
          preview: 'Pré-estréia'
          file: 'Computador'
          facebook: 'Facebook'
          dropbox: 'Dropbox'
          gdrive: 'Google Drive'
          instagram: 'Instagram'
          vk: 'VK'
          evernote: 'Evernote'
          url: 'Link da web'
        file: 
          drag: 'Arraste um arquivo para cá'
          nodrop: 'Faça upload de arquivos do seu computador'
          or: 'ou'
          button: 'Escolha um arquivo do computador'
          also: 'Você também pode escolher arquivos de'
        url: 
          title: 'Arquivos da web'
          line1: 'Faça upload de qualquer arquivo da web.'
          line2: 'Apenas informe o link.'
          input: 'Cole seu link aqui...'
          button: 'Upload'
        preview: 
          unknownName: 'desconhecido'
          change: 'Cancelar'
          back: 'Voltar'
          done: 'Adicionar'
          unknown: 
            title: 'Fazendo upload... Aguarde o preview.'
            done: 'Pular preview e aceitar'
          regular: 
            title: 'Adicionar esse arquivo?'
            line1: 'Você está prestes a adicionar o arquivo acima.'
            line2: 'Por favor, confirme.'
          image: 
            title: 'Adicionar essa imagem?'
            change: 'Cancelar'
          crop: 
            title: 'Cortar e adicionar essa imagem'
            done: 'OK'
          error: 
            default: 
              title: 'Oops!'
              text: 'Alguma coisa deu errado durante o upload.'
              back: 'Por favor, tente novamente'
            image: 
              title: 'Apenas arquivos de imagem são aceitos.'
              text: 'Por favor, tente novamente com outro arquivo.'
              back: 'Escolher a imagem'
            size: 
              title: 'O arquivo que você escolheu excede o limite.'
              text: 'Por favor, tente novamente com outro arquivo.'
          multiple: 
            title: 'Você escolheu'
            question: 'Você quer adicionar todos esses arquivos?'
            clear: 'Excluir todos'
            done: 'OK'
      footer: 
        text: 'Upload, armazenamento e processamento dos arquivos feito por'
        link: 'Uploadcare.com'
    crop: 
      error: 
        title: 'Erro'
        text: 'Não foi possível carregar a imagem'
      done: 'OK'


# Pluralization rules taken from:
# http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
uploadcare.namespace 'uploadcare.locale.pluralize', (ns) ->
  ns.pt = (n) ->
    return 'one' if n == 1
    'other'
