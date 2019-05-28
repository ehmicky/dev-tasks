import keepFuncProps from 'keep-func-props'
import asyncDone from 'async-done'

// Like Function.bind() but:
//  - does not need to specify context
//  - keeps function properties (`name`, etc.)
// We use Function.bind() to avoid creating extra stack trace frames.
// However this means context is always bound to `null`
const bindFunc = function(func, ...args) {
  return func.bind(null, ...args)
}

export const bind = keepFuncProps(bindFunc)

// To use once we abstract `bindFunc()`
// const bindContextFunc = function(func, context) {
//   return func.bind(context)
// }

// export const bindContext = keepFuncProps(bindContextFunc)

// Ignore rejection of an async function
const eSilentAsync = function(func) {
  return async (...args) => {
    try {
      await func(...args)
    } catch {}
  }
}

export const silentAsync = keepFuncProps(eSilentAsync)

// Like `async-done` but returns a promise
export const asyncDonePromise = function(func) {
  // eslint-disable-next-line promise/avoid-new
  return new Promise((resolve, reject) => {
    asyncDone(func, error => (error ? reject(error) : resolve()))
  })
}
