const assert = require('assert');
const api = require('../api');
let app = {};
let MOCK_ID = "";

let MOCK_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ilh1eGFkYXNpbHZhIiwiaWF0IjoxNTg3NTE5ODc2fQ.gY9S4CRLW9hYjDkA8nEhe0ClMUa8l8pfsZDbtfYCJ7E"
const headers = {
    Authorization: MOCK_TOKEN
}

function cadastrar() {
    return app.inject({
        method: 'POST',
        url: '/herois',
        payload: {
            nome: 'Flash',
            poder: 'Velocidade'
        },
        headers
    });
}

describe('API Heroes test suite', function ()  {
    this.beforeAll(async () => {
        app = await api;
        const result = await cadastrar();
        
        MOCK_ID = JSON.parse(result.payload).id;
    });

    it('não deve listar herois sem um token', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/herois', 
        });

        const statusCode = result.statusCode;

        assert.deepEqual(statusCode, 401);
        assert.deepEqual(JSON.parse(result.payload).error, "Unauthorized");
    });

    it('listar /herois', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/herois',
            headers
        });
        const statusCode = result.statusCode ;
        
        assert.deepEqual(statusCode, 200);
        assert.ok(Array.isArray(JSON.parse(result.payload)));
    });

    it('listar /herois - deve rertonar apenas 20 registos', async () => {
        const TAMANHO_LIMIT = 3;
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${TAMANHO_LIMIT}`,
            headers
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
            url: `/herois?skip=0&limit=${TAMANHO_LIMIT}`,
            headers
        });

        const errorResult = {"statusCode":400,"error":"Bad Request","message":"child \"limit\" fails because [\"limit\" must be a number]","validation":{"source":"query","keys":["limit"]}};
        
        assert.deepEqual(result.statusCode, 400);
        assert.deepEqual(result.payload, JSON.stringify(errorResult));
    });

    it('listar /herois - deve filtrar nome', async () => {
        const TAMANHO_LIMIT = 1000;
        const NOME = 'Iron man Clone 0';
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${TAMANHO_LIMIT}&nome=${NOME}`,
            headers
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
            },
            headers
        });
        
        const heroi = JSON.parse(result.payload);

        assert.notStrictEqual(heroi.id, undefined);
        assert.deepEqual(result.statusCode, 200);
        assert.deepEqual(heroi.nome, "Flash");

    });

    it('não deve cadastrar com payload errado', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/herois',
            payload: {
                NAME: 'Flash'
            },
            headers
        })
        const payload = JSON.parse(result.payload);
        assert.deepEqual(result.statusCode, 400);
        assert.ok(payload.message.search('"nome" is required') !== -1)
    });

    it('atualizar /herois/{id}', async () => {
        
        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${MOCK_ID}`,
            payload: {
                nome: 'Canário Negro',
                poder: 'Grito'
            },
            headers
        })
        const payload = JSON.parse(result.payload);
        
        assert.deepEqual(result.statusCode, 200);
        assert.deepEqual(payload.nModified, 1);

    });

    it('não deve atualizar com id errado', async () => {
        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${MOCK_ID}01`,
            payload: {
                nome: 'Canário Negro',
                poder: 'Grito'
            },
            headers
        })
        const payload = JSON.parse(result.payload);
        
        assert.deepEqual(result.statusCode, 400);
        assert.deepEqual(payload.message, "Bad Request");
    });

    it('remover /herois/{id}', async () => {
        
        const result =  await app.inject({
            method: 'DELETE',
            url: `/herois/${MOCK_ID}`,
            headers
        });
        const payload = JSON.parse(result.payload);
        
        assert.ok(result.statusCode === 200);
        assert.deepEqual(payload.n, 1);
        assert.deepEqual(payload.message, "Heroi removido com sucesso");

    })

    it('remover /herois/{id} - Não deve remover', async () => {
        const result =  await app.inject({
            method: 'DELETE',
            url: `/herois/0604015051450`,
            headers
        });
        const payload = JSON.parse(result.payload);
        
        assert.ok(result.statusCode === 500);
        assert.deepEqual(payload.message, "An internal server error occurred");

    })
});