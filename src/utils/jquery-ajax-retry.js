import $ from 'jquery'
import { log, warn } from '../utils/warnings'
import { isWindowDefined } from '../utils/is-window-defined'

const REQUEST_WAS_THROTTLED_CODE = 'RequestThrottledError'
const DEFAULT_THROTTLED_TIMEOUT = 15000

/**
 * @typedef {Object} RetryState
 * @property {Number} attempt
 * @property {Number} timeoutId
 * @property {JQuery.jqXHR} jqXHR
 */

/**
 * @typedef {Object} RetryConfig
 * @property {Number} baseTimeout
 * @property {Number} attempts
 * @property {Number} throttledAttempts
 * @property {Number} factor
 * @property {Function} onAttemptFail
 * @property {Boolean} debugUploads
 */

/**
 * @param {JQuery.qjXHR} jqXHR
 * @param {RetryConfig} config
 * @param {RetryState} state
 */
function getRetrySettings(jqXHR, config, state) {
  const isThrottled =
    jqXHR?.responseJSON?.error?.error_code === REQUEST_WAS_THROTTLED_CODE
  if (isThrottled && state.attempt < config.throttledAttempts) {
    const retryAfter = Number.parseFloat(jqXHR.getResponseHeader('retry-after'))
    return {
      shouldRetry: true,
      retryTimeout: Number.isFinite(retryAfter)
        ? Math.ceil(retryAfter * 1000)
        : DEFAULT_THROTTLED_TIMEOUT
    }
  }

  const isRequestFailed = ['error', 'timeout'].indexOf(jqXHR.statusText) !== -1
  if (isRequestFailed && state.attempt < config.attempts) {
    const retryTimeout = Math.round(
      config.baseTimeout * config.retryFactor ** state.attempt
    )
    return { shouldRetry: true, retryTimeout }
  }

  return { shouldRetry: false }
}

/**
 *
 * @param {JQuery.qjXHR} jqXHR
 * @param {JQuery.AjaxSettings} ajaxSettings
 * @param {RetryConfig} config
 * @param {RetryState} state
 * @returns
 */
function createPipeFilter(jqXHR, ajaxSettings, config, state) {
  return (...args) => {
    const df = new $.Deferred()

    function nextRequest() {
      state.jqXHR = $.ajax(ajaxSettings)
        .retry(config, {
          ...state,
          attempt: state.attempt + 1
        })
        .done(df.resolve)
        .fail(df.reject)
    }

    const { shouldRetry, retryTimeout } = getRetrySettings(jqXHR, config, state)
    if (shouldRetry) {
      config.onAttemptFail?.({ attempt: state.attempt })
      if (config.debugUploads) {
        log(
          `Attempt failed. Retry #${state.attempt + 1} in ${retryTimeout}ms`,
          jqXHR
        )
      }
      state.timeoutId = setTimeout(nextRequest, retryTimeout)
    } else if (jqXHR.state() === 'resolved') {
      df.resolveWith(jqXHR, args)
    } else {
      df.rejectWith(jqXHR, args)
    }

    return df
  }
}

/**
 *
 * @param {JQuery.jqXHR} jqXHR
 * @param {JQuery.AjaxSettings} ajaxSettings
 * @param {RetryConfig} retryConfig
 * @param {RetryState} retryState
 * @returns {JQuery.Deferred}
 */
function ajaxRetry(jqXHR, ajaxSettings, retryConfig, retryState) {
  const missedOption = ['baseTimeout', 'attempts', 'factor'].find(
    (key) => typeof retryConfig[key] === 'undefined'
  )
  if (missedOption) {
    warn(`Option key "${missedOption}" is missed in the retry config.`)
    return jqXHR
  }
  retryState = {
    attempt: retryState.attempt || 0,
    timeoutId: null,
    jqXHR: null
  }
  retryConfig = {
    baseTimeout: null,
    attempts: null,
    factor: null,
    onAttemptFail: null,
    debugUploads: false,
    ...retryConfig
  }
  const pipeFilter = createPipeFilter(
    jqXHR,
    ajaxSettings,
    retryConfig,
    retryState
  )
  const df = jqXHR.then(pipeFilter, pipeFilter)
  df.abort = (...args) => {
    clearTimeout(retryState.timeoutId)
    jqXHR.abort(...args)
    retryState.jqXHR?.abort(...args)
  }
  return df
}

isWindowDefined() &&
  (() => {
    $.ajaxPrefilter((ajaxSettings, _, jqXHR) => {
      jqXHR.retry = (retryConfig, retryState = {}) => {
        return ajaxRetry(jqXHR, ajaxSettings, retryConfig, retryState)
      }
    })
  })()
