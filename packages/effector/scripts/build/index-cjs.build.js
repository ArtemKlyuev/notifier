if (process.env.NODE_ENV === 'production') {
  module.exports = require('./notifier-effector.production.min.js');
} else {
  module.exports = require('./notifier-effector.development.js');
}
