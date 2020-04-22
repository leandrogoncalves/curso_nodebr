const IDb = require('./interfaceDb');
class ContextStrategy extends IDb {
  constructor(database) {
    super();
    this._database = database;
  }
  isConnected() {
    return this._database.isConnected();
  }
  static connect() {
    return this._database.connect();
  }
  create(item) {
    return this._database.create(item);
  }
  read(item, skip=0, limit=0) {
    return this._database.read(item, skip, limit);
  }
  update(id, item, upsert=false) {
    return this._database.update(id, item, upsert);
  }
  delete(id) {
    return this._database.delete(id);
  }
}

module.exports = ContextStrategy;
