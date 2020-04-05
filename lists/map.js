const service = require('./service');

Array.prototype.meuMap = function(callback) {
    const arrayMapeado = [];

    for (const i in this) {
        const resultado =  callback(this[i], i);
        arrayMapeado.push(resultado);
    }

    return arrayMapeado;
}

const main = async () => {
    try {
        const result = await service.obterPessoas('a');
        let names = [];

        console.time('forEach');
        result.results.forEach(person => {
            names.push(person.name);
        });
        console.timeEnd('forEach');
        
        console.time('map');
        // name = result.results.map(person => person.name);
        name = result.results.meuMap(person => person.name);
        console.timeEnd('map');
        
        
        console.log(name);
    } catch (error) {
        console.log('erro interno ',error);
    }
};

main();