import keepFuncProps from 'keep-func-props'

// Like Function.bind() but keeps `Function.name` because it is used by Gulp.
const bindFunc = (func, ...args) => func.bind(undefined, ...args)

export const bind = keepFuncProps(bindFunc)
