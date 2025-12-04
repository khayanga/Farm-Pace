
// import "dotenv/config";
// import { PrismaPg } from '@prisma/adapter-pg';
// import pkg from '@prisma/client'; 
// const { PrismaClient } = pkg;

// const connectionString = process.env.DIRECT_URL;

// let db;

// if (process.env.NODE_ENV === 'production') {
//   const adapter = new PrismaPg({ connectionString });
//   db= new PrismaClient({ adapter });
// } else {
//   if (!global.db) {
//     const adapter = new PrismaPg({ connectionString });
//     global.db = new PrismaClient({ adapter });
//   }
//   db = global.db;
// }

// export default db;


import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from '@prisma/client'; 
const { PrismaClient } = pkg;

/**
 * Runtime MUST use pooled connection
 */
const runtimeUrl = process.env.DATABASE_URL;

if (!runtimeUrl.includes("supabase.com")) {
  throw new Error("DATABASE_URL malformed: " + runtimeUrl);
}


/**
 * PgBouncer adapter required for Supabase pooled DB.
 */
const adapter = new PrismaPg({
  connectionString: runtimeUrl,
});

/**
 * Avoid client recreation in dev
 */
const db = global.db ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  global.db = db;
}

export default db;
