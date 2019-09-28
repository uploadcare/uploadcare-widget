
// #
// # Please, do not use this locale as a reference for new translations.
// # It could be outdated or incomplete. Always use the latest English versions:
// # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
// #
// # Any fixes are welcome.
// #
const translate = {

  loadingInfo: 'Đang tải thông tin...',
  errors: {
    default: 'Lỗi',
    baddata: 'Giá trị không đúng',
    size: 'Tệp quá lớn',
    upload: 'Không thể tải lên',
    user: 'Tải lên bị hủy',
    info: 'Không thể nạp thông tin',
    image: 'Chỉ cho phép các hình ảnh',
    createGroup: 'Không thể tạo nhóm tệp',
    deleted: 'Tệp đã bị xóa'
  },
  uploading: 'Đang tải lên... Vui lòng chờ đợi.',
  draghere: 'Thả một tệp vào đây',
  file: {
    other: '%1 tệp'
  },
  buttons: {
    cancel: 'Hủy',
    remove: 'Xóa',
    choose: {
      files: {
        other: 'Lựa chọn các tệp'
      },
      images: {
        other: 'Lựa chọn hình ảnh'
      }
    }
  },
  dialog: {
    close: 'Đóng',
    openMenu: 'Mở menu',
    done: 'Xong',
    showFiles: 'Hiển thị tệp',
    tabs: {
      names: {
        'empty-pubkey': 'Chào mừng',
        preview: 'Xem trước',
        file: 'Các tệp trên máy',
        url: 'Liên kết tr.tiếp',
        camera: 'Máy ảnh',
        facebook: 'Facebook',
        dropbox: 'Dropbox',
        gdrive: 'Google Drive',
        instagram: 'Instagram',
        gphotos: 'Google Photos',
        vk: 'VK',
        evernote: 'Evernote',
        box: 'Box',
        onedrive: 'OneDrive',
        flickr: 'Flickr',
        huddle: 'Huddle'
      },
      file: {
        drag: 'kéo & thả<br>bất kỳ tệp nào',
        nodrop: 'Tải lên các tệp từ &nbsp;máy tính của bạn',
        cloudsTip: 'Lưu trữ Đám mây<br>và các mạng xã hội',
        or: 'hoặc',
        button: 'Lựa chọn một tệp trên máy',
        also: 'hoặc lựa chọn từ'
      },
      url: {
        title: 'Các tệp trên Web',
        line1: 'Chọn bất từ tệp nào từ web.',
        line2: 'Chỉ cần cung cấp liên kết.',
        input: 'Dán liên kết của bạn xuống đây...',
        button: 'Tải lên'
      },
      camera: {
        title: 'Tệp từ web cam',
        capture: 'Chụp một bức ảnh',
        mirror: 'Gương',
        startRecord: 'Quay một video',
        cancelRecord: 'Hủy',
        stopRecord: 'Dừng',
        retry: 'Yêu cầu cấp phép lần nữa',
        pleaseAllow: {
          text: 'Bạn đã được nhắc nhở để cho phép truy cập vào camera từ trang này.<br>Để có thể chụp ảnh với camera, bạn phải chấp thuận yêu cầu này.',
          title: 'Vui lòng cho phép truy cập tới camera của bạn'
        },
        notFound: {
          title: 'Không tìm thấy camera nào',
          text: 'Có vẻ như bạn không có camera nào nối với thiết bị này.'
        }
      },
      preview: {
        unknownName: 'vô danh',
        change: 'Hủy',
        back: 'Quay lại',
        done: 'Thêm',
        unknown: {
          title: 'Đang tải lên...Vui lòng đợi để xem trước.',
          done: 'Bỏ qua và chấp nhận'
        },
        regular: {
          title: 'Thêm tệp này?',
          line1: 'Bạn dự định thêm tệp ở trên.',
          line2: 'Vui lòng chấp thuận.'
        },
        image: {
          title: 'Thêm hình ảnh này?',
          change: 'Hủy'
        },
        crop: {
          title: 'Cắt và thêm ảnh này',
          done: 'Xong',
          free: 'miễn phí'
        },
        video: {
          title: 'Thêm video này?',
          change: 'Hủy'
        },
        error: {
          default: {
            title: 'Ồ!',
            back: 'Vui lòng thử lại',
            text: 'Có lỗi gì đó trong quá trình tải lên.'
          },
          image: {
            title: 'Chỉ chấp thuận các tệp hình ảnh.',
            text: 'Vui lòng thử lại với một tệp mới.',
            back: 'Lựa chọn hình ảnh'
          },
          size: {
            title: 'Tệp bạn đã lựa chọn vượt quá giới hạn',
            text: 'Vui lòng thử lại với một tệp khác.'
          },
          loadImage: {
            title: 'Lỗi',
            text: 'Không thể tải hình ảnh'
          }
        },
        multiple: {
          title: 'Bạn đã lựa chọn %files%',
          question: 'Thêm %files%?',
          tooManyFiles: 'Bạn đã lựa chọn quá nhiều tệp. %max% là tối đa.',
          tooFewFiles: 'Bạn đã lựa chọn %files%. Ít nhất cần %min%',
          clear: 'Xoá Tất cả',
          file: {
            preview: 'Xem trước %file%',
            remove: 'Xóa %file%'
          },
          done: 'Thêm'
        }
      }
    },
    footer: {
      text: 'được hỗ trợ bởi',
      link: 'uploadcare'
    }
  }
}

// Pluralization rules taken from:
// http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
const pluralize = function (n) {
  return 'other'
}

export { translate, pluralize }
