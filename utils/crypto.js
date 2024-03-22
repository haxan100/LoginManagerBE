const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const secretKey = crypto.randomBytes(32);

function encrypt(text) {
    const iv = crypto.randomBytes(16); // Pindahkan ke dalam fungsi untuk mendapatkan IV yang berbeda setiap kali enkripsi
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { iv: iv.toString('hex'), encryptedData: encrypted };
}

function decrypt(text) {
    const iv = Buffer.from(text.iv, 'hex');
    const encryptedText = Buffer.from(text.encryptedData, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

module.exports = { encrypt, decrypt };
