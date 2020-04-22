const assert = require('assert');
const PasswordHelper = require('../helpers/passwordHelper');

const SENHA = 'leandro@123';
const HASH = '$2b$04$dc1Vpty3auSdLA0iA.4k7eo44jhL2/qm/tE44Xd1SKTcCbVQWEqle';


describe('UserHelper test suite', function () {
    it('deve gerar um hash a partir de uma senha', async () => {
        const result = await PasswordHelper.hashPassword(SENHA);

        // const result = await PasswordHelper.hashPassword('321123');
        // console.log('result', result);
        assert.ok(result.length > 10);
    });

    it('deve comparar uma senha e seu hash', async () => {
        const result = PasswordHelper.comparePassword(SENHA, HASH);
        assert.ok(result);
    });

});