const assert = require('assert');
const api = require('../api');
const Context = require('../db/strategies/base/contextStrategy');
const PostgresDB = require('../db/strategies/postgres/postgresStrategy');
const UserSchema = require('../db/strategies/postgres/schemas/userSchema');

let app = {}
const USER = {
    username: 'xuxadasilva',
    password: '123'
}

const USER_DB = {
    username: USER.username.toLowerCase(),
    password: '$2b$04$yG5TqkdyG855urvNIg0WZemEcSQ./9G7HmzxXh9oqMaNzvpHTH/8i'
}



describe('Auth test suite', function () {
    this.beforeAll(async () => {
        app = await api;

        const connectionPostgres = await PostgresDB.connect();
        const model = await PostgresDB.defineModel(connectionPostgres, UserSchema);
        const postgresModel = new Context(new PostgresDB(connectionPostgres, model));
        await postgresModel.update(null, USER_DB, true);
    });

    it('deve obter um token', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: USER
        });
        const statusCode = result.statusCode;
        const payload = JSON.parse(result.payload);

        assert.deepEqual(statusCode, 200);
        assert.ok(payload.token.length > 10);
    });

    it('deve retornar não autorizado ao tentar obter um token com login errado', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'erickwendel',
                password: '123'
            }
        });
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 401)
        assert.deepEqual(JSON.parse(result.payload).error, "Unauthorized")
    })
})