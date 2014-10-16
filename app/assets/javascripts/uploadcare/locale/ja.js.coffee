# Note: English locale is the default and used as a fallback.
uploadcare.namespace 'uploadcare.locale.translations', (ns) ->
  ns.ja =
    uploading: 'アップロードしています… 完了までお待ち下さい。'
    loadingInfo: '読み込み中…'
    errors:
      default: 'エラー'
      baddata: '間違った値'
      size: 'ファイルが大きすぎます'
      upload: 'アップロードできませんでした'
      user: 'アップロードがキャンセルされました'
      info: '読み込みに失敗しました'
      image: 'アップロードできるのは画像ファイルのみです'
      createGroup: 'グループの作成に失敗しました'
      deleted: '削除されたファイルです'
    draghere: 'ここにファイルをドロップ'
    file:
      one: '%1ファイル'
      other: '%1ファイル'
    buttons:
      cancel: 'キャンセル'
      remove: '削除'
      choose:
        files:
          one: 'ファイルを選択'
          other: 'ファイルを選択'
        images:
          one: '画像を選択'
          other: '画像を選択'
    dialog:
      done: '完了'
      showFiles: 'ファイルを表示'
      tabs:
        names:
          preview: 'プレビュー'
          file: 'ローカルファイル'
          facebook: 'Facebook'
          dropbox: 'Dropbox'
          gdrive: 'Google Drive'
          instagram: 'Instagram'
          vk: 'VK'
          evernote: 'Evernote'
          box: 'Box'
          skydrive: 'OneDrive'
          flickr: 'Flickr'
          url: 'URLを直接入力'
        file:
          drag: 'ここにファイルをドロップ'
          nodrop: 'ファイルを選択してアップロード'
          cloudsTip: 'クラウドストレージ<br>およびソーシャルサービス'
          or: 'もしくは'
          button: 'ローカルのファイルを選択'
          also: '次からも選択可能です：'
        url:
          title: 'ウェブ上のファイル'
          line1: 'ウェブ上からファイルを取得します。'
          line2: 'URLを入力してください。'
          input: 'ここにURLを貼り付けしてください…'
          button: 'アップロード'
        preview:
          unknownName: '不明なファイル'
          change: 'キャンセル'
          back: '戻る'
          done: '追加'
          unknown:
            title: 'アップロードしています… プレビューの表示をお待ちください。'
            done: 'プレビューの確認をスキップして完了'
          regular:
            title: 'このファイルを追加しますか？'
            line1: 'こちらのファイルを追加しようとしています。'
            line2: '確認してください。'
          image:
            title: 'この画像を追加しますか？'
            change: 'キャンセル'
          crop:
            title: '画像の切り取りと追加'
            done: '完了'
            free: 'リセット'
          error:
            default:
              title: '失敗しました'
              text: 'アップロード中に不明なエラーが発生しました。'
              back: 'もう一度お試し下さい'
            image:
              title: '画像ファイルのみ許可されています'
              text: '他のファイルで再度お試し下さい。'
              back: '画像を選択'
            size:
              title: 'ファイルサイズが大きすぎます。'
              text: '他のファイルで再度お試し下さい。'
            loadImage:
              title: 'エラー'
              text: '画像のロードに失敗しました。'
          multiple:
            title: '%files%つのファイルを選択中'
            question: 'これら全てのファイルを追加しますか？'
            tooManyFiles: '選択ファイルが多すぎます。%max%つ以下にしてください。'
            tooFewFiles: '選択ファイルが少なすぎます。%files%つ選択中です。少なくとも%min%つ選択してください。'
            clear: '全て削除'
            done: '完了'
      footer:
        text: '画像のアップロード、保存および加工の提供：'
        link: 'Uploadcare.com'


# Pluralization rules taken from:
# http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
uploadcare.namespace 'uploadcare.locale.pluralize', (ns) ->
  ns.ja = (n) ->
    'other'

