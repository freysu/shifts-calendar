/* eslint-disable no-undef */
jconfirm.defaults = {
  title: 'Hello',
  content: 'Are you sure to continue?',
  contentLoaded: function () {},
  icon: '',
  confirmButton: 'Okay',
  cancelButton: 'Close',
  confirmButtonClass: 'btn-default',
  cancelButtonClass: 'btn-default',
  theme: 'light',
  animation: 'none',
  closeAnimation: 'scale',
  animationSpeed: 400,
  animationBounce: 1,
  keyboardEnabled: false,
  rtl: false,
  confirmKeys: [13], // ENTER key
  cancelKeys: [27], // ESC key
  container: 'body',
  containerFluid: false,
  confirm: function () {},
  cancel: function () {},
  backgroundDismiss: true,
  autoClose: false,
  closeIcon: null,
  // columnClass: 'col-md-4 col-md-offset-8 col-xs-4 col-xs-offset-8',
  onOpen: function () {},
  onClose: function () {},
  onAction: function () {}
}

const myToast = {
  /**
   * @description toast通知
   * @param {string} type "success", "error", "warning", "info" or "neutral"
   * @param {string} text 标题
   * @param {number} time 显示时间
   * @param {string} html html类型内容，选填
   * @param {string} position 显示位置
   */
  normal: function (type, text, time, position = 'top', stay = false) {
    try {
      window.notie.alert({
        type,
        text,
        position,
        time:
          Number(time) > 1000
            ? Number(time / 1000).toFixed(2)
            : Number(time).toFixed(2),
        stay
      })
    } catch (e) {
      console.error(e.message)
    }
  }
}

var getPixelRatio = function (context) {
  var backingStore =
    context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
    1
  return (window.devicePixelRatio || 1) / backingStore
}

const actions = {
  All: false,
  Do: false,
  A: false,
  B: false,
  C: false,
  A4: false,
  A5: false,
  C4: false,
  default: false
}

var calendarConfig = {
  hasFooter: false,
  // 设置显示位置
  parent: 'multiple-pick',
  // 初始化显示时间（默认选中时间）,
  DAYS: window.isI18N
    ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat']
    : ['日', '一', '二', '三', '四', '五', '六'],
  time: formatDate(new Date()),
  // viewMode：
  // 0 - 日期模式（默认值）
  viewMode: 0,
  // pickMode：
  // multiple - 多选模式
  pickMode: 'multiple',
  // 配置日期选择的事件处理器 onDatePick，参数如下：
  // time - 选中的多个日期（已排序）时间
  // $el - 点击的 DOM 节点
  // calendar - 日历控件的实例
  onDatePick: function (time, $el, calendar) {
    var _curNode = $($el)
    for (const _key in actions) {
      if (!actions[_key]) {
        _curNode.removeClass('workHour-' + _key)
      }
    }
    for (const targetClassName in actions) {
      var tempClassName = 'workHour-' + targetClassName
      if (actions[targetClassName]) {
        if (!_curNode.hasClass(tempClassName)) {
          _curNode.addClass(tempClassName)
        } else {
          _curNode.removeClass(tempClassName)
        }
      }
    }
  }
}

function createCalendar(opt) {
  return new Calendar(opt)
}

function changeLanguae() {
  window.isI18N = !window.isI18N
  calendarConfig.DAYS = window.isI18N
    ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat']
    : ['日', '一', '二', '三', '四', '五', '六']
  $('#' + calendarConfig.parent).empty()
  createCalendar(calendarConfig)
  var curUserName = localStorage.getItem('username') || '未登录'
  $('.cal-title>.cal-text').after(
    `<span class="cal-text username">${curUserName}</span>`
  )
}

/**
 * yyyy-MM-dd hh:mm:ss.S
 * yyyy-M-d h:m:s.S
 */
function formatDate(dateObj, formatType = 'yyyy-M-d') {
  var o = {
    'M+': dateObj.getMonth() + 1, // 月份
    'd+': dateObj.getDate(), // 日
    'H+': dateObj.getHours(), // 小时
    'm+': dateObj.getMinutes(), // 分
    's+': dateObj.getSeconds(), // 秒
    'q+': Math.floor((dateObj.getMonth() + 3) / 3), // 季度
    S: dateObj.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(formatType)) {
    formatType = formatType.replace(
      RegExp.$1,
      (dateObj.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(formatType)) {
      formatType = formatType.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return formatType
}

;(function start() {
  createCalendar(calendarConfig)
  var curUserName = localStorage.getItem('username')
  if (!curUserName && !/^[A-Za-z]*(\s[A-Za-z]*)*$/.test(curUserName.trim())) {
    curUserName = 'XXX'
    localStorage.setItem('username', 'XXX')
  }

  $('.cal-title>.cal-text').after(
    `<span class="cal-text username">${curUserName}</span>`
  )

  $('.snapscreenBtn').click(() => {
    captureCalendar('multiple-pick', '#imgcanvas')
  })

  $('#changeLang').click(function () {
    changeLanguae()
  })

  $('#extractStyle').click(function () {
    translateStyle('multiple-pick')
  })

  $('.loginBtn').click(() => {
    var curUserName = localStorage.getItem('username')
    if (curUserName && curUserName.length) {
      var a = $.confirm({
        title: 'Are you sure?',
        content: `You won't be able to revert this!`,
        buttons: {
          deleteBtn: {
            text: 'Yes, change it!',
            btnClass: 'btn-red',
            action: function () {
              localStorage.setItem('username', '')
              document.querySelector('.username').innerText = '未登录'
              a.close()
              openInputAlert()
            }
          },
          cancel: function () {
            a.close()
          }
        }
      })
    } else {
      openInputAlert()
    }

    function openInputAlert() {
      var bConfirm = $.confirm({
        title: 'Please submit your name!',
        content: `<form action="" class="formName"><div class="form-group"><label>Please submit your name!</label><input type="text" placeholder="Your name" class="name form-control" required /></div></form>`,
        buttons: {
          formSubmit: {
            text: 'Submit',
            btnClass: 'btn-blue',
            action: function () {
              var name = this.$content.find('.name').val()
              if (!name) {
                myToast.normal('error', 'You need to write something!', 1500)
                return false
              }
              if (!/^[A-Za-z]*(\s[A-Za-z]*)*$/.test(name.trim())) {
                myToast.normal('error', 'Please Check it again!', 1500)
                return false
              }
              var curSaveUsername = name
              localStorage.setItem('username', curSaveUsername)
              $('.username').text(curSaveUsername)
              bConfirm.close()
              bConfirm = null
              myToast.normal(
                'success',
                `Submit Successfully！\n<h4>Hello, ${curSaveUsername}!</h4>`,
                1500
              )
            }
          },
          cancel: function () {
            bConfirm.close()
            bConfirm = null
          }
        },
        onContentReady: function () {
          // bind to events
          var jc = this
          this.$content.find('form').on('submit', function (e) {
            // if the user submits the form by pressing enter in the field.
            e.preventDefault()
            jc.$$formSubmit.trigger('click') // reference the button and click it
          })
        }
      })
    }
  })

  for (const key in actions) {
    $('.w-' + String(key)).click(() => {
      for (const _key in actions) {
        if (_key === key) {
          myToast.normal('info', `正在标记${_key}！`, 1500)
          actions[key] = true
        } else {
          actions[_key] = false
        }
      }
    })
  }

  // 根据容器ID来渲染行内样式，避免长时间卡顿
  function translateStyle(contentId) {
    const sheets = document.styleSheets
    const sheetsArry = Array.from(sheets)
    const $content = $('#' + contentId)
    sheetsArry.forEach((sheetContent) => {
      const { rules, cssRules } = sheetContent
      // cssRules兼容火狐
      const rulesArry = Array.from(rules || cssRules || [])
      rulesArry.forEach((rule) => {
        const { selectorText, style, styleMap } = rule
        // 全局样式不处理
        if (selectorText !== '*') {
          // 兼容某些样式在转换的时候会报错
          try {
            const select = $content.find(selectorText)
            select.each((domIndex) => {
              const dom = select[domIndex]
              let i = 0
              const domStyle = window.getComputedStyle(dom, null)
              while (style[i]) {
                // 样式表里的className是驼峰式，转换下便对应上了
                const newName = style[i].replace(/-\w/g, function (x) {
                  return x.slice(1).toUpperCase()
                })
                $(dom).css(style[i], domStyle[newName])
                i++
              }
            })
          } catch (e) {
            // console.log('转换成行内样式失败')
          }
        }
      })
    })
  }

  function titleCase(str) {
    return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
  }

  function sleep(duration) {
    return new Promise((resolve) => {
      setTimeout(resolve, duration)
    })
  }

  async function captureCalendar(YourTargetElem, showElm) {
    var shareContent = document.getElementById(YourTargetElem)
    var width = shareContent.offsetWidth
    var height = shareContent.offsetHeight
    var canvas = document.createElement('canvas')
    var context = canvas.getContext('2d')
    var scale = getPixelRatio(context)

    canvas.width = width
    canvas.height = height
    canvas.getContext('2d').scale(scale, scale)

    myToast.normal('info', 'Sit back, we are processing your request!', 3000)
    await sleep(3000)

    var canvas1 = await html2canvas(shareContent, {
      allowTaint: true,
      useCORS: true,
      scale: scale,
      canvas: canvas,
      logging: false,
      width: width,
      height: height,
      backgroundColor: null
    })
    var img = convertCanvasToImage(canvas1)
    img.onload = function () {
      img.onload = null
      var displayObj = {
        width: (width * scale) / (scale < 2 ? 1 : 2) + 'px',
        height: (height * scale) / (scale < 2 ? 1 : 2) + 'px'
      }
      var aConfirm = $.confirm({
        title: 'Screenshot preview',
        content: `<div class="canvasContainer">
            <div id="imgcanvas"><img src="${img.src}" style="opacity:1;z-index:9999;" alt="截图"/></div>
          </div>`,
        useBootstrap: true,
        container: 'body',
        buttons: {
          saveBtn: {
            text: 'Save',
            btnClass: 'btn-blue',
            keys: ['enter'],
            action: function () {
              download(
                img.src,
                titleCase(curUserName) + "'s available shifts.png"
              )
              aConfirm.close()
              myToast.normal('success', 'Done!', 1000)
            }
          },
          cancel: function () {
            aConfirm.close()
          }
        },
        onContentReady: function () {
          // bind to events
          var jc = this
          const img = this.$content.find('#imgcanvas img')
          const canvasContainer = this.$content.find('.canvasContainer')
          img.css({
            width: +canvas1.width / scale / (scale < 2 ? 1 : 2) + 'px',
            height: +canvas1.height / scale / (scale < 2 ? 1 : 2) + 'px'
          })
          canvasContainer.css(displayObj)
          $(document).width() > 720
            ? this.$body.css('width', '90%')
            : this.$body.css('width', '70%')
        }
      })
    }
  }

  // 绘制显示图片
  function convertCanvasToImage(canvas) {
    var image = new Image()
    image.src = canvas.toDataURL('image/png') // 生成图片地址
    return image
  }

  // 另存为图片
  function download(src, fileName) {
    // 调用下载方法
    if (browserIsIe()) {
      // 假如是ie浏览器
      return DownLoadReportIMG(fileName + '.jpg', src)
    } else {
      var $a = $('<a></a>')
        .attr('href', src)
        .attr('download', fileName + '.png')
      $a[0].click()
    }
  }
  // 判断是否为ie浏览器
  function browserIsIe() {
    if (!!window.ActiveXObject || 'ActiveXObject' in window) return true
    else return false
  }

  function DownLoadReportIMG(fileName, imgPathURL, canvas = null) {
    var blob = canvas
      ? canvas.toBlob((Blob) => {
          console.log(Blob)
        })
      : base64Img2Blob(imgPathURL)
    // ie11及以上
    window.navigator.msSaveBlob(blob, fileName)
  }
  function base64Img2Blob(code) {
    var parts = code.split(';base64,')
    var contentType = parts[0].split(':')[1]
    var raw = window.atob(parts[1])
    var rawLength = raw.length
    var uInt8Array = new Uint8Array(rawLength)
    for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i)
    }
    return new Blob([uInt8Array], { type: contentType })
  }
})()
