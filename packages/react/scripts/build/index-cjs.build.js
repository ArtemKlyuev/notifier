if (process.env.NODE_ENV === 'production') {
  module.exports = require('./notifier-react.production.min.js');
} else {
  module.exports = require('./notifier-react.development.js');
}
