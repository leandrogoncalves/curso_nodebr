function getUser() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return resolve({
                id: 1,
                name: 'Aladin',
                birthDate: new Date()
            });
        }, 1000);
    });
};

function getPhone(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return resolve({
                number: '999998888',
                ddd: '11'
            });
        }, 2000);
    });
};

function getAddress(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return resolve({
                addressLine: 'Rua Pedro Alvares Cabral',
                number: '1500'
            })
        }, 2000);
    });
};


function getUserExtraInfo(user) {
    return Promise.all([
        getPhone(user.id),
        getAddress(user.id)
    ]).then((phoneAndAddress) => {
        return {
            ...user,
            phone: phoneAndAddress[0],
            address: phoneAndAddress[1]
        };
    });
}

async function asyncAwait() {
    try {
        console.time('medida_promisse');
        const user = await getUser();
        const phoneAndAddress = await Promise.all([
            getPhone(user.id),
            getAddress(user.id)
        ]);
        
        user.phone = { ...phoneAndAddress[0] };
        user.address = { ...phoneAndAddress[1] };
        
        console.log(`
        Name: ${user.name},
        Phone: (${user.phone.ddd}) ${user.phone.number},
        Address: ${user.address.addressLine}, ${user.address.number}
        `);

        console.timeEnd('medida_promisse');
    } catch (error) {
        console.error('Something is broken: ', error);
    }
}

asyncAwait();