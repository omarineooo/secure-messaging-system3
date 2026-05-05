import forge from 'node-forge';

export const encrypt = (msg, pub) => forge.util.encode64(forge.pki.publicKeyFromPem(pub).encrypt(msg, 'RSA-OAEP'));
export const decrypt = (cipher, priv) => forge.pki.privateKeyFromPem(priv).decrypt(forge.util.decode64(cipher), 'RSA-OAEP');
