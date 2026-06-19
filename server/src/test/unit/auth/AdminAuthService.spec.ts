import jwt from 'jsonwebtoken';
import { AdminAuthService } from '../../../application/services/Auth/AdminAuthService';
import { DomainToken } from '../../../domain/errors';
import { loadTestEnv } from '../../helpers/loadTestEnv';

describe('AdminAuthService', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    loadTestEnv();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('autentica com as credenciais definidas no .env e retorna JWT válido', async () => {
    const service = new AdminAuthService();

    const result = await service.login(process.env.ADMIN_EMAIL as string, process.env.ADMIN_PASSWORD as string);

    expect(result).toEqual({
      access_token: expect.any(String),
      expires_in: process.env.JWT_EXPIRES_IN,
    });

    const decoded = jwt.verify(result.access_token, process.env.JWT_SECRET as string);
    expect(decoded).toEqual(expect.objectContaining({ email: process.env.ADMIN_EMAIL }));
  });

  it('rejeita email incorreto', async () => {
    const service = new AdminAuthService();

    await expect(service.login('outro@dualstyle.com', process.env.ADMIN_PASSWORD as string)).rejects.toThrow(
      DomainToken,
    );
  });

  it('rejeita senha incorreta', async () => {
    const service = new AdminAuthService();

    await expect(service.login(process.env.ADMIN_EMAIL as string, 'senha-errada')).rejects.toThrow(DomainToken);
  });

  it('rejeita login quando variáveis obrigatórias não existem', async () => {
    delete process.env.ADMIN_EMAIL;

    const service = new AdminAuthService();

    await expect(service.login('admin@dualstyle.com', 'admin123')).rejects.toThrow(DomainToken);
  });
});
