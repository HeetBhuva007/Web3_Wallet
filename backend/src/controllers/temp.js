const CryptoJS=require('crypto-js')

const mnemonic = "almost power artwork mango gas twice someone eternal dust pizza unfair spike";
const password = "Heet@2005";

const encrypted = CryptoJS.AES.encrypt(mnemonic, password).toString();
console.log("New Encrypted Seed:", encrypted);