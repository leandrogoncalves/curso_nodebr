const BaseRoute = require('./base/baseRoute');
const Joi = require('joi');
const Boom = require('boom');

const headers = Joi.object({
    authorization: Joi.string().required()
}).unknown();

const failAction = (request, h, err) => {
    throw err;
};

class HeroRoutes extends BaseRoute {
    constructor(db) {
        super();
        this.db = db;
    }

    list() {
        return {
            path: '/herois',
            method: 'GET',
            config: {
                tags: ['api'],
                description: 'listar herois',
                notes: 'retorna a base inteira de herois',
                validate: {
                    //payload -> body
                    //headers, params, query
                    failAction,
                    headers,
                    query: {
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(100)
                    }
                }
            },
            handler: (request) => {
                try {
                    const {skip, limit, nome} = request.query;

                    let query = {};
                    if (nome) {
                        query.nome = {$regex: `.*${nome}*.`};
                    }

                    return this.db.read(nome ? query : {},skip,limit);
                    
                } catch (error) {
                    return Boom.internal();
                }
            }
        };
    }
    create() {
        return {
            path: '/herois',
            method: 'POST',
            config: {
                tags: ['api'],
                description: 'Cadastrar heroi',
                notes: 'Cadastra heroi por nome e poder',
                validate: {
                    failAction,
                    headers,
                    payload: {
                        nome: Joi.string().min(3).max(100).required(),
                        poder: Joi.string().min(2).max(100).required()
                    }
                },

            },
            handler: async(request, headers) => {
                try{
                    const {nome, poder} = request.payload;
                    const result = await this.db.create({nome, poder});
                    console.log(result.nome);
                    
                    return {
                        message: "Heroi cadastrado com sucesso",
                        nome: result.nome,
                        poder: result.poder,
                        id: result._id,
                    }
                }catch(error){
                    return Boom.internal();
                }
              
            }
        }
    }
    update() {
        return {
            path: '/herois/{id}',
            method: 'PATCH',
            config: {
                tags: ['api'],
                description: 'Atualiza heroi',
                notes: 'Atualiza qualquer campo do heroi',
                validate: {
                    failAction,
                    headers,
                    payload: {
                        nome: Joi.string().max(100),
                        poder: Joi.string().max(30)
                    },
                    params: {
                        id: Joi.string().required()
                    }
                },

            },
            handler: async (request, headers) => {

                try{
                    const payload = request.payload;

                    const dadosString = JSON.stringify(payload);
                    const dados = JSON.parse(dadosString);

                    const id = request.params.id;
                    
                    const result = await this.db.update(id, dados);

                    if (result.nModified !== 1) return {
                        message: "Não foi possível atualizar o heroi",
                    }

                    return {
                        message: "Heroi atualizado com sucesso",
                        ...result
                    }

                }catch(error){
                        
                    return Boom.badRequest();
                }

            }
        }
    }
    delete() {
        return {
            path: '/herois/{id}',
            method: 'DELETE',
            config: {
                tags: ['api'],
                description: 'Remove heroi',
                notes: 'Remove o heroi por id',
                validate: {
                    failAction,
                    headers,
                    params: {
                        id: Joi.string().required()
                    }
                }
            },
            handler: async(request, headers) => {
                try{
                    const id = request.params.id;
                    const result = await this.db.delete(id);

                    if (result.n !== 1) 
                        return Boom.preconditionFailed("Id não encontrado") 
                    
                    return {
                        ...result,
                        message: "Heroi removido com sucesso"
                    }

                }catch(error){
                    return Boom.internal();
                }
            }
        }
    }
    
}

module.exports = HeroRoutes;