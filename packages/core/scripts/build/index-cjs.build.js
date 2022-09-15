if (process.env.NODE_ENV === 'production') {
  module.exports = require('./notifier-core.production.min.js');
} else {
  module.exports = require('./notifier-core.development.js');
}
