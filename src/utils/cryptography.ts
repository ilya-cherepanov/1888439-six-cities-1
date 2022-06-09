import crypto from 'crypto';
import * as jose from 'jose';


const getSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};


const createJWT = async (algorithm: string, jwtSecret: string, payload: object): Promise<string> => (
  new jose.SignJWT({...payload})
    .setProtectedHeader({alg: algorithm})
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(crypto.createSecretKey(jwtSecret, 'utf-8'))
);


export {getSHA256, createJWT};
