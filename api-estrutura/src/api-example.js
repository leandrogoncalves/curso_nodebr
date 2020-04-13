const Hapi = require('hapi');
const Context = require('./db/strategies/base/contextStrategy');
const MongoDB = require('./db/strategies/mongoDB/mongoDbStrategy');
const HeroiSchema = require('./db/strategies/mongoDB/schemas/heroiSchema');


const app = new Hapi.Server({
    port: 5000
});

async function main() {
    const connection = MongoDB.connect();
    const context = new Context(new MongoDB(connection, HeroiSchema));

    app.route({
        path: '/herois',
        method: 'GET',
        handler: (request, headers) => {
            return context.read();
        }
    });

    await app.start();
    console.log('server running at', app.info.port);
}
main();