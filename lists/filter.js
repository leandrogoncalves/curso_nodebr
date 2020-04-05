const { obterPessoas } = require('./service');

Array.prototype.meuFilter = function(callback) {
    const lista = [];

    for (const i in this) {
        const item = this[i];
        const result =  callback(item, i, this);
        if (! result) {
            continue;
        }
        lista.push(item);
    }

    return lista;
}

const main = async () => {
    try {
        const {
            results
        } = await obterPessoas('a');

        const family = results.meuFilter(
            (person) => person.name.toLowerCase().indexOf('lars') !== -1
        );

        const names = family.map(person=>person.name);

        console.log(names);
        
    } catch (error) {
        console.log('erro interno ',error);
    }
};

main();
