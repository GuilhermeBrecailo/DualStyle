import { PrismaClient } from '@prisma/client';
import { buildApp } from './app';

const prisma = new PrismaClient();

async function bootstrap(): Promise<void> {
  const app = await buildApp({ prisma });
  const port = Number(process.env.PORT ?? 8080);

  await app.listen({ port, host: '0.0.0.0' });
}

void bootstrap();
