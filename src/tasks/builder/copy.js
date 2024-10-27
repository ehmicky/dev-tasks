import gulp from 'gulp'

import {
  BUILD,
  GENERATED_SOURCES_DIR,
  JAVASCRIPT_EXTS_STR,
  SOURCES_GLOB,
  TYPESCRIPT_EXT,
} from '../../files.js'

const SOURCES_ONLY_GLOB = `${GENERATED_SOURCES_DIR}/**`
export const copy = () =>
  gulp
    .src(
      [
        `${SOURCES_GLOB}/*[^~]`,
        `!${SOURCES_GLOB}/*.{${JAVASCRIPT_EXTS_STR},${TYPESCRIPT_EXT}}`,
        `!${SOURCES_ONLY_GLOB}`,
      ],
      {
        dot: true,
        since: gulp.lastRun(copy),
        resolveSymlinks: false,
        encoding: false,
      },
    )
    .pipe(gulp.dest(BUILD))
