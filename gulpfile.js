// We do not use `build` directory nor 'gulpfile.babel.js` to avoid
// hard-to-debug problems due to recursion.
// Instead we call `@babel/register` and import the `src` directory.
// eslint-disable-next-line import/no-unassigned-import
import './src/tasks/builder/register.js'

export * from './src/main.js'
export { download } from './gulp/download.js'
