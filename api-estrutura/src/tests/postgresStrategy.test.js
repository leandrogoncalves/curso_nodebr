const { equal, deepEqual, ok } = require('assert');
const PostgresStrategy = require('../db/strategies/postgres/postgresStrategy');
const HeroiSchema = require('../db/strategies/postgres/schemas/heroiSchema');
const Context = require('../db/strategies/base/contextStrategy');
const MOCK_HEROI_CADASTRAR = { nome: 'Gaviao Negro', poder: 'flexas' };
const MOCK_HEROI_ATUALIZAR = { nome: 'Mulher Gavião', poder: 'grito' };

// 1o criar pasta postgres
// 2o criar schema heroiSchema
// 3o alterar classe postgres
  // constructor
  // defineModel
  // isConnected
  // connection
  // alterar _herois para _schema

// 4o alterar teste
  //adicionar connect
  // adicionar defineModel
  // adicionar context
// testar
let context = {};

describe('PostgreSQL Strategy', function() {

  this.timeout(Infinity);

  before(async () => {
    const connection = await PostgresStrategy.connect();
    const model = await PostgresStrategy.defineModel(connection, HeroiSchema);
    context = new Context(new PostgresStrategy(connection, model));

    await context.delete();
    await context.create(MOCK_HEROI_CADASTRAR);
    await context.create(MOCK_HEROI_ATUALIZAR);
  });

  it('PostgresSQL connection', async () => {
    const result = await context.isConnected();
    equal(result, true);
  });

  it('cadastrar', async () => {
    const result = await context.create(MOCK_HEROI_CADASTRAR);
    delete result.dataValues.id;
    deepEqual(result.dataValues, MOCK_HEROI_CADASTRAR);
  });

  it('listar', async () => {
    const [result] = await context.read(MOCK_HEROI_CADASTRAR);
    delete result.id;
    deepEqual(result, MOCK_HEROI_CADASTRAR);
  });

  it('atualizar', async () => {
    const [result] = await context.read({nome: MOCK_HEROI_ATUALIZAR.nome});

    const novoItem = {
      ...MOCK_HEROI_CADASTRAR,
      nome: 'Mulher Maravilha',
    };
    const [update] = await context.update(result.id, novoItem);
    const [itemAtualizado] = await context.read({id:result.id});

    deepEqual(itemAtualizado.nome, novoItem.nome);
    deepEqual(update, 1);
  });

  it('remover', async () => {
    const [item] = await context.read({});
    const result = await context.delete(item.id);
    deepEqual(result, 1);
  });
});
