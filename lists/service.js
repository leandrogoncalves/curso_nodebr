const axios = require('axios');
const URL = 'https://swapi.co/api/people';

async function obterPessoas(name){
    const url = `${URL}/?search=${name}&format=json`;
    const response = await axios.get(url);
    return response.data;
}

// obterPessoas('r2')
//     .then((result)=>{
//         console.log('result ', result);
        
//     })
//     .catch((error)=>{
//         console.error('deu ruim', error);
        
//     });

module.exports = {
    obterPessoas
}