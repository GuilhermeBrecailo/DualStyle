import jwt from 'jsonwebtoken';
import { DomainToken } from '../../../domain/errors';

export class AdminAuthService {
  async login(email: string, password: string): Promise<{ access_token: string; expires_in: string }> {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN ?? '7d';

    if (!adminEmail || !adminPassword || !jwtSecret) {
      throw new DomainToken('Credenciais inválidas');
    }

    if (email !== adminEmail || password !== adminPassword) {
      throw new DomainToken('Credenciais inválidas');
    }

    const accessToken = jwt.sign({ email }, jwtSecret, { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] });

    return {
      access_token: accessToken,
      expires_in: expiresIn,
    };
  }
}
