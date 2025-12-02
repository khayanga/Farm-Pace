
import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from '@prisma/client'; 
const { PrismaClient } = pkg;

const connectionString = process.env.DIRECT_URL;

let db;

if (process.env.NODE_ENV === 'production') {
  const adapter = new PrismaPg({ connectionString });
  db= new PrismaClient({ adapter });
} else {
  if (!global.db) {
    const adapter = new PrismaPg({ connectionString });
    global.db = new PrismaClient({ adapter });
  }
  db = global.db;
}

export default db;