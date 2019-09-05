import uploadcare from '../namespace'

##
## Please, do not use this locale as a reference for new translations.
## It could be outdated or incomplete. Always use the latest English versions:
## https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
##
## Any fixes are welcome.
##

uploadcare.namespace 'locale.translations', (ns) ->
  ns.zhTW =
    uploading: '上傳中...請等待'
    loadingInfo: '正在讀取資訊...'
    errors:
      default: '錯誤'
      baddata: '錯誤資料'
      size: '檔案太大'
      upload: '無法上傳'
      user: '上傳被取消'
      info: '無法讀取資訊'
      image: '只允許圖片檔案'
      createGroup: '無法建立檔案群組'
      deleted: '檔案已被刪除'
    draghere: '拖放檔案到這裡'
    file:
      other: '%1 個檔案'
    buttons:
      cancel: '取消'
      remove: '刪除'
      choose:
        files:
          one: '選擇檔案'
          other: '選擇檔案'
        images:
          one: '選擇圖片'
          other: '選擇圖片'
    dialog:
      done: '完成'
      showFiles: '顯示檔案'
      tabs:
        names:
          'empty-pubkey': '歡迎'
          preview: '預覽'
          file: '從本機上傳'
          url: '任意圖片連結'
          camera: '相機'
        file:
          drag: '拖放檔案到這裡'
          nodrop: '從你的本機中上傳'
          cloudsTip: '雲端硬碟<br>與社群網站'
          or: '或者'
          button: '從本機中選取檔案'
          also: '你也可以選自'
        url:
          title: '來自網際網路的檔案'
          line1: '從網際網路選取檔案'
          line2: '只需提供連結'
          input: '將連結複製至此...'
          button: '上傳'
        camera:
          capture: '拍照'
          mirror: '鏡像'
          retry: '重新取得相機權限'
          pleaseAllow:
            title: '請允許使存取您的相機'
            text: '你一直在提示允許來自這個網站的訪問攝像頭。' +
                  '為了拍照用你的相機，你必須批准這一請求。'
          notFound:
            title: '沒有找到相機'
            text: '看起來你有沒有將連接相機。'
        preview:
          unknownName: '未知'
          change: '取消'
          back: '返回'
          done: '加入'
          unknown:
            title: '上傳中...請等待預覽'
            done: '跳過預覽，直接接受'
          regular:
            title: '加入這個檔案？'
            line1: '你將加入上面的檔案。'
            line2: '請確認。'
          image:
            title: '加入這個圖片？'
            change: '取消'
          crop:
            title: '裁切並加入這個圖片'
            done: '完成'
            free: '自由裁切'
          error:
            default:
              title: '錯誤！'
              text: '上傳過程中出錯。'
              back: '請重試'
            image:
              title: '只允許上傳圖片檔案。'
              text: '請選擇其他檔案重新上傳。'
              back: '選擇圖片'
            size:
              title: '你選取的檔案超過了100MB的上限'
              text: '請用另一個檔案再試一次。'
            loadImage:
              title: '錯誤'
              text: '無法讀取圖片'
          multiple:
            title: '你已經選擇 %files%'
            question: '你要加入所有檔案嗎？'
            tooManyFiles: '你選了太多的檔案. 最多可選擇%max%. 請刪除一些。'
            tooFewFiles: '你所選擇的檔案 %files%. 至少要 %min% .'
            clear: '清空'
            done: '完成'


# Pluralization rules taken from:
# http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
uploadcare.namespace 'locale.pluralize', (ns) ->
  ns.zhTW = (n) ->
    'other'
