const crypto = require ('crypto');
// Generate a random encryption key and IV (Initialization Vector)
const encryptionKey = crypto.randomBytes(32); // 256 bits
const iv = crypto.randomBytes(16); // 128 bits
class PasswordEncryptDecrypt {
    
    async encryptPassword(password){
        // const saltRounds = Number(process.env.WORKFACTOR);
        // const hashedPassword = await bcrypt.hash(password, saltRounds);
        // console.log(hashedPassword)
        // return hashedPassword;
        const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    async verifyPassword(password, hashedPassword) {
        // const result = await bcrypt.compare(password, hashedPassword);
        // return result;
        const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}

module.exports = new PasswordEncryptDecrypt();