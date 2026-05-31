import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const hash = await bcrypt.hash('Admin_2620*', 10);

  await prisma.usuario.upsert({
    where: { usuario: 'admin' },
    update: {},
    create: {
      nombre: 'Administrador',
      usuario: 'admin',
      password: hash,
      rol: 'administrador',
      activo: true,
    },
  });

  console.log('✅ Seed ejecutado correctamente');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
