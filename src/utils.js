import keepFuncProps from 'keep-func-props'

// Like Function.bind() but `Function.name` because it is used by Gulp.
const bindFunc = function (func, ...args) {
  return func.bind(undefined, ...args)
}

export const bind = keepFuncProps(bindFunc)
