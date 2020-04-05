const { get } = require('axios');
const URL = 'https://swapi.co/api/people';

async function obterPessoas(name){
    const url = `${URL}/?search=${name}&format=json`;
    const response = await get(url);
    return response.data.results.map(mapPerson);
}

function mapPerson(item){
    return {
        nome: item.name,
        altura: item.height
    }
}

module.exports = {
    obterPessoas
}