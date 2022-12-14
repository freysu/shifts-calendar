/* eslint-disable no-undef */
// var timeFormat = 'HH:mm:ss'

// function configureLogging(logs) {
//   const colors = {
//     error: 'red',
//     warn: 'orange',
//     info: 'blue',
//     time: 'magenta',
//     log: 'black',
//     debug: 'green'
//   }
//   function log(level, messages) {
//     const text = messages
//       .map((message) => {
//         return typeof message === 'object'
//           ? JSON.stringify(message, null, 2)
//           : message
//       })
//       .join(' ')
//     const _level = level.toLowerCase()
//     const fontColor = colors[_level]
//     const textSpan = `<span style="color:${fontColor}">[${level}]: ${htmlEncode(
//       text
//     )}</span>`
//     const _timestamp = htmlEncode(getNowFormatDate(new Date(), timeFormat))
//     logs.innerHTML =
//       `<span style="color:grey">[${_timestamp}]</span> ${textSpan}\n\n` +
//       logs.innerHTML
//   }

//   console._error = console.error
//   console.error = function (...rest) {
//     log('ERROR', Array.prototype.slice.call(rest))
//     console._error.apply(this, rest)
//   }

//   console._warn = console.warn
//   console.warn = function (...rest) {
//     log('WARN', Array.prototype.slice.call(rest))
//     console._warn.apply(this, rest)
//   }

//   console._log = console.log
//   console.log = function (...rest) {
//     log('LOG', Array.prototype.slice.call(rest))
//     console._log.apply(this, rest)
//   }

//   console._info = console.info
//   console.info = function (...rest) {
//     log('INFO', Array.prototype.slice.call(rest))
//     console._info.apply(this, rest)
//   }

//   console._debug = console.debug
//   console.debug = function (...rest) {
//     log('DEBUG', Array.prototype.slice.call(rest))
//     console._debug.apply(this, rest)
//   }
// }

// function htmlEncode(code) {
//   // 1.首先动态创建一个容器标签元素，如DIV
//   var temp = document.createElement('div')
//   // 2.然后将要转换的字符串设置为这个元素的innerText或者textContent
//   temp.textContent !== undefined
//     ? (temp.textContent = code)
//     : (temp.innerText = code)
//   // 3.最后返回这个元素的innerHTML，即得到经过HTML编码转换的字符串了
//   var output = temp.innerHTML
//   temp = null
//   return output
// }

// /**
//  * @description: 日期格式化函数1
//  * @param date 日期类型
//  * @param format 日期格式  默认 yyyy-MM-dd HH:mm:ss格式
//  */
// function getNowFormatDate(date, format = 'yyyy-MM-dd HH:mm:ss') {
//   const theCurrentDate = new Date(date.getTime()) // 转换日期格式
//   const year = theCurrentDate.getFullYear().toString()
//   format = format.replace('yyyy', year) // 替换年份
//   const month = (theCurrentDate.getMonth() + 1).toString().padStart(2, '0')
//   format = format.replace('MM', month) // 替换月份
//   const day = theCurrentDate.getDate().toString().padStart(2, '0')
//   format = format.replace('dd', day) // 替换天
//   const hour = theCurrentDate.getHours().toString().padStart(2, '0')
//   format = format.replace('HH', hour) // 替换小时
//   const minutes = theCurrentDate.getMinutes().toString().padStart(2, '0')
//   format = format.replace('mm', minutes) // 替换分钟
//   const second = theCurrentDate.getSeconds().toString().padStart(2, '0')
//   format = format.replace('ss', second) // 替换秒
//   return format
// }

window.jconfirm.defaults = {
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
  useBootstrap: !($('body').width() < 845),
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
  C4: false
  // default: false
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
  var curUserName = localStorage.getItem('username') || 'XXX'
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
      (dateObj.getFullYear() + '').substring(4 - RegExp.$1.length)
    )
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(formatType)) {
      formatType = formatType.replace(
        RegExp.$1,
        RegExp.$1.length == 1
          ? o[k]
          : ('00' + o[k]).substring(('' + o[k]).length)
      )
    }
  }
  return formatType
}

String.prototype.replaceAt = function (index, replacement) {
  return (
    this.substring(0, index) +
    replacement +
    this.substring(index + replacement.length)
  )
}

$(document).ready(function () {
  // configureLogging(document.querySelector('.logs'))
  // var feMonitor = new FeMonitor({
  //   isOpenError: true,
  //   isOpenPerformance: false
  // })
  // feMonitor.init()
  createCalendar(calendarConfig)
  var curUserName = localStorage.getItem('username')
  if (
    curUserName === null ||
    typeof curUserName === 'undefined' ||
    !curUserName.length ||
    !/^[A-Za-z]*(\s[A-Za-z]*)*$/.test(curUserName.trim())
  ) {
    curUserName = 'XXX'
    localStorage.setItem('username', 'XXX')
  }

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
        title: '你将要重新填写！',
        content: `你已填写过名字，你确定要修改吗？`,
        buttons: {
          deleteBtn: {
            text: '确定',
            btnClass: 'btn-red',
            action: function () {
              localStorage.setItem('username', '')
              document.querySelector('.username').innerText = 'XXX'
              a.close()
              openInputAlert()
            }
          },
          cancel: {
            text: '取消',
            action: function () {
              a.close()
            }
          }
        }
      })
    } else {
      openInputAlert()
    }

    function openInputAlert() {
      var bConfirm = $.confirm({
        title: '填写一下你的英文名吧!',
        content: `<form action="" class="formName"><div class="form-group"><label>你的英文名：</label><input type="text" placeholder="Your name" class="name form-control" required /></div></form>`,
        buttons: {
          formSubmit: {
            text: 'Submit',
            btnClass: 'btn-blue',
            action: function () {
              var name = this.$content.find('.name').val()
              if (!name) {
                myToast.normal('error', '你需要写点什么！', 2500)
                return false
              }
              if (!/^[A-Za-z]*(\s[A-Za-z]*)*$/.test(name.trim())) {
                myToast.normal('error', '请再次检查输入的是否为英文名', 2500)
                return false
              }
              var curSaveUsername = name
              localStorage.setItem('username', curSaveUsername)
              $('.username').text(curSaveUsername)
              bConfirm.close()
              bConfirm = null
              myToast.normal(
                'success',
                `<p>保存成功！以后将会自动读取！</p>\n<h4>Hello, ${curSaveUsername}!</h4>`,
                3000
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

  $('.w-clear').click(() => {
    for (const key in actions) {
      var curClassName = '.workHour-' + String(key)
      console.log('$(curClassName).length: ', $(curClassName).length)
      $(curClassName).length &&
        $(curClassName).removeClass(curClassName.replace('.', ''))
      myToast.normal('success', '已清除所有标记！', 1500)
    }
  })

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

    var curAllMarkStr = ''
    var curIdx = 1
    for (const key in actions) {
      curAllMarkStr += $('.workHour-' + key).length
        ? ` ${key} 有 ${$('.workHour-' + key).length} 个${
            !(+curIdx % 2) ? ';<br>' : ';'
          }`
        : ''
      curIdx++
    }
    console.log('curMarkArr: ', curAllMarkStr)
    var _curAllMarkStr = curAllMarkStr.length
      ? curAllMarkStr.replaceAt(curAllMarkStr.length - 1, '！')
      : '暂未标记！'
    myToast.normal(
      'info',
      `<p>稍等片刻，截图正在生成！</p>当前${_curAllMarkStr}`,
      4000
    )
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
        title: '截图预览',
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
})
