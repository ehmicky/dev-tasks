'use strict'

module.exports = {
  ...require('./test'),
  ...require('./build'),
  ...require('./check'),
  ...require('./unit'),
  ...require('./warn'),
  ...require('./release'),
}
