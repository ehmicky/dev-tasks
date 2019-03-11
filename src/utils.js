'use strict'

const keepFuncProps = require('keep-func-props')
const asyncDone = require('async-done')

// Like Function.bind() but:
//  - does not bind context
//  - keeps function properties (`name`, etc.)
const bindFunc = function(func, ...args) {
  return func.bind(null, ...args)
}

const bind = keepFuncProps(bindFunc)

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
  silentAsync: eSilentAsync,
  asyncDonePromise,
}
