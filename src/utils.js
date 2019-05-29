import keepFuncProps from 'keep-func-props'

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
