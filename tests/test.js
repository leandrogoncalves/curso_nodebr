const assert = require('assert');
const { obterPessoas } = require('./service');
const nock = require('nock');

// assert.ok(false);

// install mocha para rodar o dscribe
describe('Star Wars Tests', function(){
    this.beforeAll(function(){
        const response = {
            count: 1,
            next: null,
            previous: null,
            results: [
                {
                    name: 'R2-D2',
                    height: '96',
                    mass: '32',
                    hair_color: 'n/a',
                    skin_color: 'white, blue',
                    eye_color: 'red',
                    birth_year: '33BBY',
                    gender: 'n/a',
                    homeworld: 'https://swapi.co/api/planets/8/',
                    vehicles: [],
                    starships: [],
                    created: '2014-12-10T15:11:50.376000Z',
                    edited: '2014-12-20T21:17:50.311000Z',
                    url: 'https://swapi.co/api/people/3/'
                }
            ]
        }

        //instalar nock para mockar a resposta da API
        nock('https://swapi.co/api/people')
            .get('/?search=r2-d2&format=json')
            .reply(200, response);
    });

    it('Deve buscar R2-D2 com o formato correto', async ()=>{
        const expected = [{nome: 'R2-D2', altura: '96'}];
        const nomeBase = 'r2-d2';

        const resultado = await obterPessoas(nomeBase);
        assert.deepEqual(resultado, expected);
    });
});