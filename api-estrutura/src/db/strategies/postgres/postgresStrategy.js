const IDb = require('../base/interfaceDb');
const Sequelize = require('sequelize');

class PostgreSQLConnection {
  static connect() {}
}

class PostgreSQLStrategy extends IDb {
  constructor(connection, schema) {
    super();
    this._schema = schema;
    this._connection = connection;
  }

  static async defineModel(connection, schema) {
    const model = connection.define(
      schema.name, schema.schema, schema.options,
    );
    await model.sync();
    return model;
  }

  static async connect() {
    const sequelize = new Sequelize(process.env.POSTGRES_URL,{
        // case sensitive
        quoteIdentifiers: false,
        // deprecation warning
        operatorsAliases: false,
        //Log query
        logging: false,
        ssl: process.env.SSL_DB,
        dialectOptions: {
          ssl: process.env.SSL_DB,
        }
    });

    return sequelize;
  }

  async isConnected() {
    try {
      // await this._connect();
      await this._connection.authenticate();
      return true;
    } catch (error) {
      console.error('fail!', error);
      return false;
    }
  }

  create(item) {
    return this._schema.create(item, { raw: true });
  }

  read(item) {
    return this._schema.findAll({ where: item, raw: true });
  }

  update(id, item, upsert = false) {
    const fn = upsert ? 'upsert' : 'update';
    return this._schema[fn](item, {
      where: {
        id
      }
    });
    // return this._schema.update(item, { where: { id } });
  }
  delete(id) {
    const query = id ? { id } : {};
    return this._schema.destroy({ where: query });
  }
}

module.exports = PostgreSQLStrategy;
