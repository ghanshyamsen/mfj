import CryptoJS from 'crypto-js';

const secretKey = '9=K(Yr&9gr"%~ikH.H(~Y~{7[e2p1F(f'; // Use a secure, unique key in a real application

export const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, secretKey).toString();
};

export const decrypt = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const LOCATIONAPIKEY = {
    apiKey: process.env.REACT_LOCATION_API_KEY
};
  