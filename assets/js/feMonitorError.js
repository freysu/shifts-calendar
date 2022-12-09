/*
 * @Author: freysu
 * @Date: 2022-12-09 22:06:57
 * @LastEditors: freysu
 * @LastEditTime: 2022-12-10 02:01:54
 * @Description: file content
 */

// 前面加;是防止跟其他js压缩时报错
;(function (global) {
  // 开启严格模式
  'use strict'

  const formatTime = (time) => new Date(time).getTime()

  // 构造函数定义一个类    传参数
  function FeMonitor(options) {
    this.options = options || {}
    this.errorList = {
      resourceError: [],
      promiseError: [],
      fetchError: [],
      jsError: [],
      xhrLoadError: []
    }
    this.performanceCollector = {
      pv: [],
      blank: [],
      longTask: [],
      timing: [],
      paint: [],
      firstInputDelay: []
    }
    //   this.srr = []
    //   this.drr = []
  }

  // 原型上提供方法
  FeMonitor.prototype = {
    send: function (currentErrorObj) {
      const { performanceCollector, errorList } = this
      const { errorType, type, eventType = '' } = currentErrorObj
      console.log('currentErrorObj: ', currentErrorObj)
      if (!['xhr', 'fetch', 'error'].includes(type)) {
        // this.srr.push(type)
        // this.srr = Array.from(new Set(this.srr))
        performanceCollector[type].push(currentErrorObj)
      } else {
        var str = ''
        if (eventType !== 'error') {
          str = titleCase(eventType) + 'Error'
        } else {
          str = titleCase(eventType)
        }
        var errorTypeName = String(errorType || type + str)
        // this.drr.push(errorTypeName)
        // this.drr = Array.from(new Set(this.drr))
        errorList[errorTypeName].push(currentErrorObj)
      }
    },
    show: function () {
      console.log(this.errorList, this.performanceCollector)
      return this
    },
    blankScreen: function () {
      var _this = this

      const wrapperElements = ['html', 'body', '#container', '.content']
      let emptyPoints = 0
      function getSelector(element) {
        const { id, className, nodeName } = element
        if (id) {
          return '#' + id
        } else if (className) {
          // 过滤空白符 + 拼接
          return (
            '.' +
            className
              .split(' ')
              .filter((item) => !!item)
              .join('.')
          )
        } else {
          return nodeName.toLowerCase()
        }
      }
      function isWrapper(element) {
        const selector = getSelector(element)
        if (wrapperElements.indexOf(selector) !== -1) {
          emptyPoints++
        }
      }
      // 刚开始页面内容为空，等页面渲染完成，再去做判断
      onload(function () {
        let xElements, yElements
        for (let i = 0; i < 9; i++) {
          xElements = document.elementsFromPoint(
            (window.innerWidth * i) / 10,
            window.innerHeight / 2
          )
          yElements = document.elementsFromPoint(
            window.innerWidth / 2,
            (window.innerHeight * i) / 10
          )
          isWrapper(xElements[0])
          isWrapper(yElements[0])
        }
        // 白屏
        if (emptyPoints >= 0) {
          const centerElements = document.elementsFromPoint(
            window.innerWidth / 2,
            window.innerHeight / 2
          )
          // console.log(
          //   'emptyPoints++++++++++++++',
          //   getSelector(centerElements[0])
          // )
          _this.send({
            kind: 'stability',
            type: 'blank',
            emptyPoints: emptyPoints + '',
            screen: window.screen.width + 'X' + window.screen.height,
            viewPoint: window.innerWidth + 'X' + window.innerHeight,
            selector: getSelector(centerElements[0])
          })
        }
      })
    },
    injectJsError: function () {
      var _this = this
      // 监听全局未捕获的错误
      window.addEventListener(
        'error',
        (event) => {
          // console.log('error+++++++++++', event)
          const lastEvent = getLastEvent() // 获取到最后一个交互事件
          // 脚本加载错误
          if (event.target && (event.target.src || event.target.href)) {
            _this.send({
              kind: 'stability', // 监控指标的大类，稳定性
              type: 'error', // 小类型，这是一个错误
              errorType: 'resourceError', // js执行错误
              filename: event.target.src || event.target.href || '', // 哪个文件报错了
              tagName: event.target.tagName || '',
              selector: getSelector(event.target) // 代表最后一个操作的元素
            })
          } else {
            _this.send({
              kind: 'stability', // 监控指标的大类，稳定性
              type: 'error', // 小类型，这是一个错误
              errorType: 'jsError', // js执行错误
              message: event.message || '', // 报错信息
              filename: event.filename || '', // 哪个文件报错了
              position: `${event.lineno || ''}:${event.colno || ''}`, // 报错的行列位置
              stack: getLines(event.error ? event.error.stack : ''),
              selector: lastEvent ? getSelector(lastEvent.path || '') : '' // 代表最后一个操作的元素
            })
          }
        },
        true
      )
      window.addEventListener(
        'unhandledrejection',
        (event) => {
          // console.log('unhandledrejection-------- ', event)
          const lastEvent = getLastEvent() // 获取到最后一个交互事件
          let message
          let filename
          let line = 0
          let column = 0
          let stack = ''
          const reason = event.reason
          if (typeof reason === 'string') {
            message = reason
          } else if (typeof reason === 'object') {
            message = reason.message
            if (reason.stack) {
              const matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/)
              filename = matchResult[1]
              line = matchResult[2]
              column = matchResult[3]
            }
            stack = getLines(reason.stack)
          }
          _this.send({
            kind: 'stability', // 监控指标的大类，稳定性
            type: 'error', // 小类型，这是一个错误
            errorType: 'promiseError', // js执行错误
            message, // 报错信息
            filename, // 哪个文件报错了
            position: `${line}:${column}`, // 报错的行列位置
            stack,
            selector: lastEvent ? getSelector(lastEvent.path) : '' // 代表最后一个操作的元素
          })
        },
        true
      )
    },
    injectFetch: function () {
      const oldFetch = window.fetch
      var _this = this
      function hijackFetch(url, options) {
        const startTime = Date.now()
        return new Promise((resolve, reject) => {
          oldFetch.apply(this, [url, options]).then(
            async (response) => {
              // response 为流数据
              const oldResponseJson = response.__proto__.json
              response.__proto__.json = function (...responseRest) {
                return new Promise((responseResolve, responseReject) => {
                  oldResponseJson.apply(this, responseRest).then(
                    (result) => {
                      responseResolve(result)
                    },
                    (responseRejection) => {
                      // 接口
                      _this.sendLogData({
                        url,
                        startTime,
                        statusText: response.statusText,
                        status: response.status,
                        eventType: 'error',
                        response: responseRejection.stack,
                        options
                      })
                      responseReject(responseRejection)
                    }
                  )
                })
              }
              resolve(response)
            },
            (rejection) => {
              // 连接未连接上
              _this.sendLogData({
                url,
                startTime,
                eventType: 'load',
                response: rejection.stack,
                options
              })
              reject(rejection)
            }
          )
        })
      }
      window.fetch = hijackFetch
    },
    sendLogData: function ({
      startTime,
      statusText = '',
      status = '',
      eventType,
      url,
      options,
      response
    }) {
      var _this = this
      // 持续时间
      const duration = Date.now() - startTime
      const { method = 'get', body } = options || {}
      _this.send({
        kind: 'stability',
        type: 'fetch',
        eventType: eventType,
        pathname: url,
        status: status + '-' + statusText, // 状态码
        duration,
        response: response ? JSON.stringify(response) : '', // 响应体
        method,
        params: body || '' // 入参
      })
    },
    longTask: function () {
      var _this = this
      new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 100) {
            const lastEvent = getLastEvent() || {}
            requestIdleCallback(() => {
              _this.send({
                kind: 'experience',
                type: 'longTask',
                eventType: lastEvent.type || '',
                startTime: formatTime(entry.startTime), // 开始时间
                duration: formatTime(entry.duration), // 持续时间
                selector: lastEvent
                  ? getSelector(lastEvent.path || lastEvent.target)
                  : ''
              })
            })
          }
        })
      }).observe({ entryTypes: ['longtask'] })
    },
    pv: function () {
      var _this = this
      var connection = navigator.connection
      _this.send({
        kind: 'business',
        type: 'pv',
        effectiveType: connection.effectiveType, // 网络环境
        rtt: connection.rtt, // 往返时间
        screen: `${window.screen.width}x${window.screen.height}` // 设备分辨率
      })
      const startTime = Date.now()
      window.addEventListener(
        'unload',
        () => {
          const stayTime = Date.now() - startTime
          _this.send({
            kind: 'business',
            type: 'stayTime',
            stayTime
          })
        },
        false
      )
    },
    timing: function () {
      var _this = this
      let FMP, LCP
      // 增加一个性能条目的观察者
      new PerformanceObserver((entryList, observer) => {
        const perfEntries = entryList.getEntries()
        FMP = perfEntries[0]
        observer.disconnect() // 不再观察了
      }).observe({ entryTypes: ['element'] }) // 观察页面中有意义的元素
      // 增加一个性能条目的观察者
      new PerformanceObserver((entryList, observer) => {
        const perfEntries = entryList.getEntries()
        const lastEntry = perfEntries[perfEntries.length - 1]
        LCP = lastEntry
        observer.disconnect() // 不再观察了
      }).observe({ entryTypes: ['largest-contentful-paint'] }) // 观察页面中最大的元素
      // 增加一个性能条目的观察者
      new PerformanceObserver((entryList, observer) => {
        const lastEvent = getLastEvent()
        const firstInput = entryList.getEntries()[0]
        if (firstInput) {
          // 开始处理的时间 - 开始点击的时间，差值就是处理的延迟
          const inputDelay = firstInput.processingStart - firstInput.startTime
          const duration = firstInput.duration // 处理的耗时
          if (inputDelay > 0 || duration > 0) {
            _this.send({
              kind: 'experience', // 用户体验指标
              type: 'firstInputDelay', // 首次输入延迟
              inputDelay: inputDelay ? formatTime(inputDelay) : 0, // 延迟的时间
              duration: duration ? formatTime(duration) : 0,
              startTime: firstInput.startTime, // 开始处理的时间
              selector: lastEvent
                ? getSelector(lastEvent.path || lastEvent.target)
                : ''
            })
          }
        }
        observer.disconnect() // 不再观察了
      }).observe({ type: 'first-input', buffered: true }) // 第一次交互
      // 刚开始页面内容为空，等页面渲染完成，再去做判断
      onload(function () {
        setTimeout(() => {
          const {
            fetchStart,
            connectStart,
            connectEnd,
            requestStart,
            responseStart,
            responseEnd,
            domLoading,
            domInteractive,
            domContentLoadedEventStart,
            domContentLoadedEventEnd,
            loadEventStart
          } = window.performance.timing
          // 发送时间指标
          _this.send({
            kind: 'experience', // 用户体验指标
            type: 'timing', // 统计每个阶段的时间
            connectTime: connectEnd - connectStart, // TCP连接耗时
            ttfbTime: responseStart - requestStart, // 首字节到达时间
            responseTime: responseEnd - responseStart, // response响应耗时
            parseDOMTime: loadEventStart - domLoading, // DOM解析渲染的时间
            domContentLoadedTime:
              domContentLoadedEventEnd - domContentLoadedEventStart, // DOMContentLoaded事件回调耗时
            timeToInteractive: domInteractive - fetchStart, // 首次可交互时间
            loadTime: loadEventStart - fetchStart // 完整的加载时间
          })
          // 发送性能指标
          const FP = performance.getEntriesByName('first-paint')[0]
          const FCP = performance.getEntriesByName('first-contentful-paint')[0]
          // console.log('FP', FP)
          // console.log('FCP', FCP)
          // console.log('FMP', FMP)
          // console.log('LCP', LCP)
          _this.send({
            kind: 'experience',
            type: 'paint',
            firstPaint: FP ? formatTime(FP.startTime) : 0,
            firstContentPaint: FCP ? formatTime(FCP.startTime) : 0,
            firstMeaningfulPaint: FMP ? formatTime(FMP.startTime) : 0,
            largestContentfulPaint: LCP
              ? formatTime(LCP.renderTime || LCP.loadTime)
              : 0
          })
        }, 3000)
      })
    },
    injectXHR: function () {
      var _this = this
      const XMLHttpRequest = window.XMLHttpRequest
      const oldOpen = XMLHttpRequest.prototype.open
      XMLHttpRequest.prototype.open = function (method, url, async) {
        // 把上报接口过滤掉
        if (!url.match(/logstores/) && !url.match(/sockjs/)) {
          this.logData = { method, url, async }
        }
        return oldOpen.apply(this, arguments)
      }
      const oldSend = XMLHttpRequest.prototype.send
      XMLHttpRequest.prototype.send = function (body) {
        if (this.logData) {
          const startTime = Date.now()
          const handler = (type) => (event) => {
            // 持续时间
            const duration = Date.now() - startTime
            const status = this.status
            const statusText = this.statusText
            _this.send({
              kind: 'stability',
              type: 'xhr',
              eventType: type,
              pathname: this.logData.url,
              status: status + '-' + statusText, // 状态码
              duration,
              response: this.response ? JSON.stringify(this.response) : '', // 响应体
              params: body || '' // 入参
            })
          }
          this.addEventListener('load', handler('load'), false)
          this.addEventListener('error', handler, false)
          this.addEventListener('abort', handler, false)
        }
        return oldSend.apply(this, arguments)
      }
    },
    init: function () {
      const { isOpenPerformance = false, isOpenError = true } = this.options
      if (isOpenError) {
        this.injectJsError()
        this.injectXHR()
        this.injectFetch()
      }
      if (isOpenPerformance) {
        this.blankScreen()
        this.timing()
        this.longTask()
        this.pv()
      }
      return this
    }
  }

  function titleCase(str) {
    return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
  }

  function getExtraData() {
    return {
      title: document.title,
      url: location.href,
      timestamp: Date.now(),
      userAgent: userAgent.parse(navigator.userAgent).name
    }
  }

  function getLastEvent() {
    let lastEvent
      // body
    ;['click', 'touchstart', 'mousedown', 'keydown', 'mouseover'].forEach(
      (eventType) => {
        document.addEventListener(
          eventType,
          (event) => {
            lastEvent = event
          },
          {
            capture: true, // 是在捕获阶段还是冒泡阶段执行
            passive: true // 默认不阻止默认事件
          }
        )
      }
    )
    return lastEvent
  }

  function getSelectors(path) {
    // 反转 + 过滤 + 映射 + 拼接
    return path
      .reverse()
      .filter((element) => {
        return element !== document && element !== window
      })
      .map((element) => {
        // console.log('element', element.nodeName)
        let selector = ''
        if (element.id) {
          return `${element.nodeName.toLowerCase()}#${element.id}`
        } else if (element.className && typeof element.className === 'string') {
          return `${element.nodeName.toLowerCase()}.${element.className}`
        } else {
          selector = element.nodeName.toLowerCase()
        }
        return selector
      })
      .join(' ')
  }
  function getSelector(pathsOrTarget) {
    if (Array.isArray(pathsOrTarget)) {
      return getSelectors(pathsOrTarget)
    } else {
      const path = []
      while (pathsOrTarget) {
        path.push(pathsOrTarget)
        pathsOrTarget = pathsOrTarget.parentNode
      }
      return getSelectors(path)
    }
  }

  function onload(callback) {
    if (document.readyState === 'complete') {
      callback()
    } else {
      window.addEventListener('load', callback)
    }
  }

  function getLines(stack) {
    return stack
      .split('\n')
      .slice(1)
      .map((item) => item.replace(/^\s+at\s+/g, ''))
      .join('^')
  }

  if (typeof module !== 'undefined' && module.exports) {
    // 兼容CommonJs规范
    module.exports = FeMonitor
  } else if (typeof define === 'function') {
    // 兼容AMD/CMD规范
    define(function () {
      return FeMonitor
    })
  } else {
    // 注册全局变量，兼容直接使用script标签引入插件
    global.FeMonitor = FeMonitor
  }
})(this)
