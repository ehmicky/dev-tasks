import keepFuncProps from 'keep-func-props'
import asyncDone from 'async-done'

// Like Function.bind() but `Function.name` because it is used by Gulp.
const bindFunc = function(func, ...args) {
  return func.bind(null, ...args)
}

export const bind = keepFuncProps(bindFunc)

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
