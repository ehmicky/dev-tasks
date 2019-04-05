'use strict'

const { keepFuncProps } = require('keep-func-props')
const asyncDone = require('async-done')

// Like Function.bind() but:
//  - does not need to specify context
//  - keeps function properties (`name`, etc.)
// We use Function.bind() to avoid creating extra stack trace frames.
// However this means context is always bound to `null`
const bindFunc = function(func, ...args) {
  return func.bind(null, ...args)
}

const bind = keepFuncProps(bindFunc)

const bindContextFunc = function(func, context) {
  return func.bind(context)
}

const bindContext = keepFuncProps(bindContextFunc)

// Ignore rejection of an async function
const silentAsync = function(func) {
  return async (...args) => {
    try {
      await func(...args)
    } catch {}
  }
}

const eSilentAsync = keepFuncProps(silentAsync)

// Like `async-done` but returns a promise
const asyncDonePromise = function(func) {
  // eslint-disable-next-line promise/avoid-new
  return new Promise((resolve, reject) => {
    asyncDone(func, error => (error ? reject(error) : resolve()))
  })
}

module.exports = {
  bind,
  bindContext,
  silentAsync: eSilentAsync,
  asyncDonePromise,
}
