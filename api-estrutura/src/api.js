const Hapi = require('hapi');
const Context = require('./db/strategies/base/contextStrategy');
const MongoDB = require('./db/strategies/mongoDB/mongoDbStrategy');
const HeroSchema = require('./db/strategies/mongoDB/schemas/heroiSchema');
const HeroRoutes = require('./routes/heroRoutes');

const Postgres = require('./db/strategies/postgres/postgresStrategy');
const UserSchema = require('./db/strategies/postgres/schemas/userSchema');

const AuthRoutes = require('./routes/authRoutes');
const MINHA_CHAVE_SECRETA = 'ESSA_E_TRETA'


const HapiSwagger = require('hapi-swagger');
const Vision = require('vision');
const Inert = require('inert');
const HapiJwt = require('hapi-auth-jwt2');

const app = new Hapi.Server({
    port: 5000
});

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]());
}

async function main() {
    const connectionPostgres = await Postgres.connect();
    const model = await Postgres.defineModel(connectionPostgres, UserSchema);
    const postgresModel = new Context(new Postgres(connectionPostgres, model));

    const connection = MongoDB.connect();
    const mongoDb = new Context(new MongoDB(connection, HeroSchema));

    const swaggerConfig = {
        info: {
            title: '#CursoNodeBR - API Herois',
            version: 'v1.0'
        },
        lang: 'pt'
    };

    await app.register([
        HapiJwt,
        Vision,
        Inert,
        {
            plugin: HapiSwagger,
            options: swaggerConfig
        }
    ]);

    app.auth.strategy('jwt', 'jwt', {
        key: MINHA_CHAVE_SECRETA,
        options: {
            expiresIn: 300
        },
        validate: (dado, request) => {
            //Faz as validações de autenticacao
            return {
                isValid: true
            }
        }
    });

    app.auth.default('jwt');

    app.route([
        ...mapRoutes(new HeroRoutes(mongoDb), HeroRoutes.methods()),
        ...mapRoutes(new AuthRoutes(MINHA_CHAVE_SECRETA, postgresModel), AuthRoutes.methods())
    ])

    await app.start();
    console.log('server running at', app.info.port);

    return app;
}
module.exports = main();