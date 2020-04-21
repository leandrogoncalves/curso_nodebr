const BaseRoute = require('./base/baseRoute');
class HeroRoutes extends BaseRoute {
    constructor(db) {
        super();
        this.db = db;
    }

    list() {
        return {
            path: '/herois',
            method: 'GET',
            handler: (request) => {
                try {
                    const {skip, limit, nome} = request.query;

                    let query = {};
                    if (nome) {
                        query.nome = nome;
                    }

                    if (skip && isNaN(skip)) {
                        throw Error('O tipo de skip deve ser numerico');
                    }

                    if (limit && isNaN(limit)) {
                        throw Error('O tipo de limit deve ser numerico');
                    }

                    return this.db.read(query,parseInt(skip),parseInt(limit));
                    
                } catch (error) {
                    return "Erro interno do servidor";
                }
            }
        };
    }
    create() {
        return {
            path: '/herois',
            method: 'POST',
            handler: (request) => {
                const payload = request.payload;
                return this.db.create(payload);
            }
        };
    }
    
}

module.exports = HeroRoutes;