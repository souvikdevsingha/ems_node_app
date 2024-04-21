const bcrypt = require ('bcrypt');
class PasswordEncryptDecrypt {

    async encryptPassword(password){
        const saltRounds = Number(process.env.WORKFACTOR);
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    }

    async verifyPassword(password, hashedPassword) {
        const result = await bcrypt.compare(password, hashedPassword);
        return result;
    }
}

module.exports = new PasswordEncryptDecrypt();