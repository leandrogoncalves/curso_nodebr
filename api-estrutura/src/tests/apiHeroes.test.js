const assert = require('assert');
const api = require('../api');
let app = {};


describe.only('API Heroes test suite', function ()  {
    this.beforeAll(async () => {
        app = await api;
    });

    it('listar /herois', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/herois'
        });
        const statusCode = result.statusCode ;
        
        assert.deepEqual(statusCode, 200);
        assert.ok(Array.isArray(JSON.parse(result.payload)));
    });

    it('listar /herois - deve rertonar apenas 20 registos', async () => {
        const TAMANHO_LIMIT = 3;
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${TAMANHO_LIMIT}`
        });
        
        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode ;
        
        assert.deepEqual(statusCode, 200);
        assert.ok(dados.length === TAMANHO_LIMIT);
    });

    it('listar /herois - deve validar query string', async () => {
        const TAMANHO_LIMIT = 'aaaa';
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${TAMANHO_LIMIT}`
        });
        
        assert.deepEqual(result.payload, 'Erro interno do servidor');
    });

    it('listar /herois - deve filtrar nome', async () => {
        const TAMANHO_LIMIT = 1000;
        const NOME = 'Iron man Clone 4';
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${TAMANHO_LIMIT}&nome=${NOME}`
        });
        
        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode ;
        
        assert.deepEqual(statusCode, 200);
        assert.ok(dados[0].nome === NOME);
    });

    it('cadastrar /herois', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/herois',
            payload: {
                nome: 'Flash',
                poder: 'Velocidade'
            }
        });
        assert.deepEqual(result.statusCode, 200);
        assert.deepEqual(JSON.parse(result.payload).nome, "Flash");

    });

});