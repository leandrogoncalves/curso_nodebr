const { obterPessoas } = require('./service');

Array.prototype.meuReduce = function(callback, initialValue) {
    let finalValue = typeof initialValue !== undefined ? initialValue : this[0];

    for (let index = 0; index <= this.length -1; index++) {
        finalValue = callback(finalValue, this[index], this);
    }

    return finalValue;
}

const main = async () => {
    try {
        // const {
        //     results
        // } = await obterPessoas('a');

        // const heights = results.map(item=>parseInt(item.height));

        const myList = [
            ['eric','wendel'],
            ['Leandro','Goncalve'],
            ['php','sp']
        ];


        const total = myList.meuReduce((previous, next)=>{
            return previous.concat(next);
        }, []) 
            .join(', ');

        console.log('myList: ',myList);
        console.log('total: ',total);
        

    } catch (error) {
        console.log('erro interno ',error);
    }
};

main();