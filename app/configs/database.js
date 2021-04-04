
const serviceLocator = require('../lib/service_locator');
const logger = serviceLocator.get('logger');

class Database {
  constructor(port, host, name, connection_string) {
    this.mongoose = serviceLocator.get('mongoose');
    this._connectWithString(connection_string)
  }

  _connectWithString(connection_string) {
    this.mongoose.Promise = global.Promise;
    
    this.mongoose.set('useNewUrlParser', true);
    this.mongoose.set('useFindAndModify', false);
    this.mongoose.set('useCreateIndex', true);
    this.mongoose.set('useUnifiedTopology', true);

    this.mongoose.connect(connection_string);
    const {connection} = this.mongoose;
    connection.on('connected', () =>
      logger.info('Database Connection was Successful')
    );
    connection.on('error', (err) =>
      logger.info('Database Connection Failed' + err)
    );
    connection.on('disconnected', () =>
      logger.info('Database Connection Disconnected')
    );
    process.on('SIGINT', () => {
      connection.close();
      logger.info(
        'Database Connection closed due to NodeJs process termination'
      );
      process.exit(0);
    });

    // initialize Model
    require('../models/users');
  }
}

module.exports = Database;