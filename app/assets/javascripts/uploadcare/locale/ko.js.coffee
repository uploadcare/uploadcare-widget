import uploadcare from './namespace.coffee'

##
## Please, do not use this locale as a reference for new translations.
## It could be outdated or incomplete. Always use the latest English versions:
## https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js.coffee
##
## Any fixes are welcome.
##

uploadcare.namespace 'locale.translations', (ns) ->
  ns.ko =
    uploading: '업로드중 기다려주세요'
    loadingInfo: '정보 로드중...'
    errors:
      default: '오류'
      baddata: '잘못된 값'
      size: '파일용량 초과'
      upload: '업로드 실패'
      user: '업로드 취소됨'
      info: '정보를 불러올 수 없습니다'
      image: '허용된 이미지만 가능'
      createGroup: '파일 그룹 만들기 실패'
      deleted: '파일이 삭제되었습니다'
    draghere: '여기에 끌어다 놓기'
    file:
      one: '%1 파일'
      other: '%1 파일'
    buttons:
      cancel: '취소'
      remove: '삭제'
      choose:
        files:
          one: '파일 첨부'
          other: '파일 첨부'
        images:
          one: '이미지 첨부'
          other: '이미지 첨부'
    dialog:
      close: '닫기'
      openMenu: '메뉴 열기'
      done: '완료'
      showFiles: '파일 표시'
      tabs:
        names:
          'empty-pubkey': '반갑습니다'
          preview: '미리보기'
          file: '파일 첨부'
          url: '링크 연결'
          camera: '카메라'
          facebook: '페이스북'
          dropbox: '드롭박스'
          gdrive: '구글 드라이브'
          gphotos: '구글 포토'
          instagram: '인스타그램'
          evernote: '에버노트'
          box: '박스'
          onedrive: '스카이드라이브'
          flickr: '플리커'
        file:
          drag: '모든 파일을<br>드래그 & 드롭'
          nodrop: '파일 업로드'
          cloudsTip: '클라우드 스토리지 및 소셜'
          or: '또는'
          button: '파일 선택'
          also: '또는 선택하십시오'
        url:
          title: '웹에서 파일 링크 연결'
          line1: '웹에서 모든파일을 가져옵니다'
          line2: '링크만 연결합니다.'
          input: '링크 붙여 넣기...'
          button: '업로드'
        camera:
          title: '카메라 연결'
          capture: '사진 찍기'
          mirror: '거울'
          startRecord: '비디오 녹화'
          stopRecord: '정지'
          cancelRecord: '취소'
          retry: '재 시도'
          pleaseAllow:
            title: '카메라 접근 허용'
            text: '카메라 접근을 허용하시겠습니까?<br>' +
                  '승인 요청을 해주셔야 합니다'
          notFound:
            title: '카메라가 없습니다'
            text: '이 기기에 연결된 카메라가 없습니다'
        preview:
          unknownName: '알수없음'
          change: '취소'
          back: '뒤로'
          done: '추가'
          unknown:
            title: '업로드중, 기다려주세요'
            done: '미리보기 건너뛰기'
          regular:
            title: '이 파일을 추가하시겠습니까?'
            line1: '위 파일을 추가하려고 합니다'
            line2: '확인 하십시오'
          image:
            title: '이미지를 추가하시겠습니까?'
            change: '취소'
          crop:
            title: '이미지 자르기 및 추가'
            done: '완료'
            free: '무료'
          video:
            title: '비디오를 추가하시겠습니까?'
            change: '취소'
          error:
            default:
              title: '죄송합니다'
              text: '업로드에 문제가 있습니다'
              back: '다시 시도해 주세요'
            image:
              title: '이미지 파일만 허용됩니다'
              text: '다른 파일로 다시 시도하세요'
              back: '이미지 선택'
            size:
              title: '선택한 파일이 한도 초과하였습니다'
              text: '다른 파일로 다시 시도하세요'
            loadImage:
              title: '오류'
              text: '이미지를 불러올 수 없습니다'
          multiple:
            title: '%files%을(를) 선택하였습니다'
            question: '%files%을 추가하시겠습니까?'
            tooManyFiles: '너무 많은 파일을 추가하셨습니다. %max%가 최대 한도입니다'
            tooFewFiles: '%files%을(를) 선택하였습니다 최소 %min%이상 필요합니다'
            clear: '모두 삭제'
            done: '추가'
            file:
              preview: '%file% 미리보기'
              remove: '%file% 삭제'
      footer:
        text: 'powered by'
        link: 'uploadcare'


# Pluralization rules taken from:
# http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
uploadcare.namespace 'locale.pluralize', (ns) ->
  ns.ko = (n) ->
    return 'one' if n == 1
    'other'
