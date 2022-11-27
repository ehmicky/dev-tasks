import { deleteAsync } from 'del'
import gulp from 'gulp'

import { NOT_BUILT_SOURCES, BUILD } from '../../files.js'
import { getWatchTask } from '../../watch.js'

import { babel } from './babel.js'
import { copy } from './copy.js'
import { buildTypes } from './types.js'

// We remove files deeply but leave empty [sub]directories. Otherwise it creates
// issues with `chokidar` (file watching used by `ava --watch` and
// `gulp.watch()`)
const clean = () => deleteAsync(`${BUILD}/**`, { onlyFiles: true })

const rebuild = gulp.parallel(copy, babel, buildTypes)
export const build = gulp.series(clean, rebuild)

// eslint-disable-next-line fp/no-mutation
build.description = 'Build source files'

const buildWatchTask = getWatchTask(NOT_BUILT_SOURCES, rebuild)
export const buildWatch = gulp.series(build, buildWatchTask)

// eslint-disable-next-line fp/no-mutation
buildWatch.description = 'Build source files (watch mode)'
