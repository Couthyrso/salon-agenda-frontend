import cryptoJs from "crypto-js";

const SECRET_KEY = 'xbyGSwvENdpx+Kl80rXn9odSH/LuKMR6JPZ8L6pt4C8=';

export function encryptToken(token) {
    return cryptoJs.AES.encrypt(token, SECRET_KEY).toString();
}

export function decryptToken(ciphertext) {
    const bytes = cryptoJs.AES.decrypt(ciphertext, SECRET_KEY);
    return bytes.toString(cryptoJs.enc.Utf8);
}