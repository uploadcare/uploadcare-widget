# Note: English locale is the default and used as a fallback.
uploadcare.namespace 'uploadcare.locale.translations', (ns) ->
  ns.ar =
    uploading: 'الرجاء الإنتظار.... يتم الرفع'
    loadingInfo: '...تحميل المعلومات'
    errors:
      default: 'خطأ'
      baddata: 'قيمة غير صحيحة'
      size: 'ملف كبير جدا'
      upload: 'لا يمكن تحميل'
      user: ' إلغاء التحميل'
      info: 'لا يمكن تحميل معلومات'
      image: 'مسموح بالصور فقط' 
      createGroup: 'لا يمكن إنشاء مجموعة ملفات'
      deleted: 'تم حذف ملف'
    draghere: 'إفلت الملف هنا'
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
      done: 'منجز'
      showFiles: 'إظهار الملفات'
      tabs:
        names:
          preview: 'معاينة'
          file: 'الملفات المحلية'
          url: 'روابط التعسفية'
          camera: 'كاميرا'
        file:
          drag: 'إفلات الملف هنا'
          nodrop: 'تحميل الملفات من جهاز الكمبيوتر الخاص بك'
          cloudsTip: 'المخازن السحابية<br>والخدمات الاجتماعية'
          or: 'أو'
          button: 'اختر ملف محلي'
          also: 'يمكنك أيضا اختيار من'
        url:
          title: 'الملفات من الويب'
          line1: 'اختر على أي ملف من الويب'
          line2: 'قم بتقديم الارتباط'
          input: 'الصق الرابط الخاص بك هنا ...'
          button: 'تحميل'
        camera:
          capture: 'إلتقط صورة'
          mirror: 'مرآة'
          retry: 'إعادة طلب الأذونات'
          pleaseAllow:
            title: 'الرجاء السماح بتشغيل كميرتك '
            text: 'لقد تم السماح للكاميرا بالوصول لهذا الموقع. ' +
                  'لكي تلتقط الصور بكاميرتك، يجب السماح لهذا الطلب '
          notFound:
            title: 'لم يتم العثور على كاميرا '
            text: 'يبدو أنه لا يوجد كاميرا موصولة بهذا الجهاز'
        preview:
          unknownName: 'غير معروف'
          change: 'إلغاء'
          back: 'العودة'
          done: 'إضافة'
          unknown:
            title: 'جاري التحميل .. الرجاء الانتظار للمعاينة.'
            done: 'تخطي المعاينة، واقبل'
          regular:
            title: 'إضافة هذا الملف؟'
            line1: 'أنت على وشك إضافة الملف أعلاه.'
            line2: 'يرجى تأكيد.'
          image:
            title: 'إضافة هذه الصورة؟'
            change: 'إلغاء'
          crop:
            title: 'قص وإضافة هذه الصورة'
            done: 'تم'
            free: 'حرر'
          error:
            default:
              title: 'عفوا!'
              text: 'حدث خطأ أثناء تحميل.'
              back: 'يرجى المحاولة مرة أخرى'
            image:
              title: 'فقط ملفات الصور مقبولة.'
              text: 'يرجى المحاولة مرة أخرى مع ملف آخر.'
              back: 'اختيار صورة'
            size:
              title: 'الملف الذي حددته يتجاوز الحد.'
              text: 'يرجى المحاولة مرة أخرى مع ملف آخر.'
            loadImage:
              title: 'خطأ'
              text: 'لا يمكن تحميل صورة'
          multiple:
            title: 'لقد أخترت %files%'
            question: 'هل ترغب في إضافة كل من هذه الملفات?'
            tooManyFiles: 'لقد اخترت العديد من الملفات. %max% is الحد الأقصى.'
            tooFewFiles: 'لقد أخترت %files%. على الأقل %min% مطلوب.'
            clear: 'إزالة جميع'
            done: 'تم'
      footer:
        text: ' تحميل وتخزين ومعالجة الملفات بوساطة'


# Pluralization rules taken from:
# http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
uploadcare.namespace 'uploadcare.locale.pluralize', (ns) ->
  ns.ar = (n) ->
    return 'zero' if n == 0
    return 'one' if n == 1
    return 'two' if n == 2
    mod = n % 100
    return 'few' if 3 <= mod <= 10
    return 'many' if 11 <= mod <= 99
    'other'
