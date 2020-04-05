const EventEmitter = require('events');

class MeuEmissor extends EventEmitter {

}

const meuEmissor = new MeuEmissor();
const nomeEvento = 'usuario:click';

meuEmissor.on(nomeEvento, function(click){
    console.log('event', click);
});


const stdin = process.openStdin();

function main(){
    return new Promise((resolve, reject)=>{
        stdin.addListener('data', (value) => {
            return resolve(value);
        });
    });
}

main().then((result)=>{
    console.log(`voce digitou ${result.toString().trim()}`);
})


// meuEmissor.emit(nomeEvento, 'na barra de ralagem');
// meuEmissor.emit(nomeEvento, 'na ok');

// let count = 0;
// setInterval(()=>{
//     meuEmissor.emit(nomeEvento, 'no ok '+(count++))
// },1000)
