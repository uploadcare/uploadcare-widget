import uploadcare from '../namespace.coffee'

##
## Please, do not use this locale as a reference for new translations.
## It could be outdated or incomplete. Always use the latest English versions:
## https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js.coffee
##
## Any fixes are welcome.
##

uploadcare.namespace 'locale.translations', (ns) ->
  ns.ar =
    uploading: 'جاري الرفع... الرجاء الانتظار'
    loadingInfo: 'جار تحميل المعلومات ...'
    errors:
      default: 'خطأ'
      baddata: 'قيمة غير صحيحة'
      size: 'ملف كبير جداً'
      upload: 'يتعذر الرفع'
      user: 'تم إلغاء الرفع'
      info: 'يتعذر تحميل المعلومات'
      image: 'يسمح بالصور فقط'
      createGroup: 'لا يمكن إنشاء مجموعة ملفات'
      deleted: 'تم حذف الملف'
    draghere: 'أسقط ملف هنا'
    file:
      one: '%1 ملف'
      other: '%1 ملفات'
    buttons:
      cancel: 'إلغاء'
      remove: 'إزالة'
      choose:
        files:
          one: 'اختر ملف'
          other: 'اختر ملفات'
        images:
          one: 'اختر صورة'
          other: 'اختر صور'
    dialog:
      close: 'أغلق'
      openMenu: 'افتح القائمة'
      done: 'موافق'
      showFiles: 'اظهار الملفات'
      tabs:
        names:
          'empty-pubkey': 'مرحبا!'
          preview: 'معاينة'
          file: 'ملفات محلية'
          url: 'رابط مباشر'
          camera: 'كاميرا'
          facebook: 'فيس بوك'
          dropbox: 'دروب بوكس'
          gdrive: 'جوجل دريف'
          gphotos: 'صور غوغل'
          instagram: 'إينستجرام'
          vk: 'في كي'
          evernote: 'إيفرنوت'
          box: 'بوكس'
          onedrive: 'ون درايف'
          flickr: 'فليكر'
          huddle: 'هادل'
        file:
          drag: 'سحب وإفلات<br>أي ملف'
          nodrop: 'رفع ملفات من&nbsp;الحاسوب'
          cloudsTip: 'مخازن على السحابة<br>والشبكات الاجتماعية'
          or: 'أو'
          button: 'اختر ملف محلي'
          also: 'أو اختر من'
        url:
          title: 'ملفات من شبكة الإنترنت'
          line1: 'التقاط أي ملف من على شبكة الإنترنت'
          line2: 'فقط قم بتوفير الرابط'
          input: 'الصق الرابط هنا...'
          button: 'رفع'
        camera:
          title: 'ملف من كاميرا الويب'
          capture: 'التقاط صورة'
          mirror: 'عكس الصورة'
          startRecord: 'سجل فيديو'
          stopRecord: 'توقف'
          cancelRecord: 'إلغاء'
          retry: 'طلب الإذن مرة أخرى'
          pleaseAllow:
            title: 'يرجى السماح بالوصول إلى الكاميرا'
            text: 'تمت مطالبتك بالسماح بالدخول إلى الكاميرا من هذا الموقع<br>' +
                  'من أجل التقاط الصور من الكاميرا يجب عليك الموافقة على هذا الطلب'
          notFound:
            title: 'لم يتم اكتشاف أي كاميرا'
            text: 'يبدو أنه ليس لديك كاميرا متصلة بهذا الجهاز'
        preview:
          unknownName: 'غير معروف'
          change: 'إلغاء'
          back: 'الرجوع'
          done: 'إضافة'
          unknown:
            title: 'جار الرفع ... يرجى الانتظار للحصول على معاينة'
            done: 'تخطي المعاينة والقبول'
          regular:
            title: 'إضافة هذا الملف؟'
            line1: 'أنت على وشك إضافة الملف أعلاه'
            line2: 'يرجى التأكيد'
          image:
            title: 'إضافة هذة الصورة'
            change: 'إلغاء'
          crop:
            title: 'قص وإضافة هذه الصورة'
            done: 'موافق'
            free: 'حر'
          video:
            title: 'إضافة هذا الفيديو'
            change: 'إلغاء'
          error:
            default:
              title: 'عفوا آسف'
              text: 'حدث خطأ أثناء الرفع'
              back: 'حاول مرة اخرى'
            image:
              title: 'يتم قبول ملفات الصور فقط'
              text: 'الرجاء إعادة المحاولة باستخدام ملف آخر'
              back: 'اختر صورة'
            size:
              title: 'الملف الذي حددتة يتجاوز الحد المسموح بة'
              text: 'الرجاء إعادة المحاولة باستخدام ملف آخر'
            loadImage:
              title: 'خطأ'
              text: 'لا يمكن تحميل الصورة'
          multiple:
            title: 'لقد اخترت %files%'
            question: 'إضافة %files%?'
            tooManyFiles: 'لقد اخترت عددا كبيرا جدا من الملفات %max% هو الحد الأقصى'
            tooFewFiles: 'لقد اخترت %files%. على الأقل %min% مطلوب'
            clear: 'حذف الكل'
            done: 'إضافة'
            file:
              preview: 'معاينة %file%'
              remove: 'حذف %file%'
      footer:
        text: 'مدعوم بواسطة'
        link: 'ابلود كير'


# Pluralization rules taken from:
# http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
uploadcare.namespace 'locale.pluralize', (ns) ->
  ns.ar = (n) ->
    return 'zero' if n == 0
    return 'one' if n == 1
    return 'two' if n == 2
    mod = n % 100
    return 'few' if 3 <= mod <= 10
    return 'many' if 11 <= mod <= 99
    'other'
