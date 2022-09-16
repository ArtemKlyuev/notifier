if (process.env.NODE_ENV === 'production') {
  module.exports = require('./notifier-mobx.production.min.js');
} else {
  module.exports = require('./notifier-mobx.development.js');
}
