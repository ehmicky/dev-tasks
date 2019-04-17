export const buildRegister = function() {
  // eslint-disable-next-line global-require
  require('@babel/register')({ presets: [`${__dirname}/.babelrc.js`] })
}
