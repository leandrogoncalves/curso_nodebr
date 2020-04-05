const service = require('./service');

(async () => {

    try {
        const result = await service.obterPessoas('a');
        let names = [];
        
        console.time('for');
        for (let i = 0; i < result.results.length; i++) {
            const person = result.results[i];
            names.push(person.name);
        }
        console.timeEnd('for');
        
        names = [];

        console.time('forIn');
        for (const i in result.results) {
            const person =  result.results[i];
            names.push(person.name);
        }
        console.timeEnd('forIn');
        
        names = [];

        console.time('forOf');
        for (person of result.results) {
            names.push(person.name);
        }
        console.timeEnd('forOf');

        console.log('names', names);
        
    } catch (error) {
        console.log('erro interno ',error);
    }

})();

