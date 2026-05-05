import forge from 'node-forge';
import bcrypt from 'bcryptjs';

// RSA Logic
export async function generateKeyPair() {
  return new Promise((resolve, reject) => {
    forge.pki.rsa.generateKeyPair({ bits: 2048, workers: -1 }, (err, pair) => {
      if (err) reject(err);
      resolve({
        publicKey: forge.pki.publicKeyToPem(pair.publicKey),
        privateKey: forge.pki.privateKeyToPem(pair.privateKey)
      });
    });
  });
}

export const encrypt = (msg, pub) => forge.util.encode64(forge.pki.publicKeyFromPem(pub).encrypt(msg, 'RSA-OAEP'));
export const decrypt = (cipher, priv) => forge.pki.privateKeyFromPem(priv).decrypt(forge.util.decode64(cipher), 'RSA-OAEP');

// Auth Logic
export const hashPassword = (p) => bcrypt.hash(p, 10);
export const comparePassword = (p, h) => bcrypt.compare(p, h);
