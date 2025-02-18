import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

/*

Problem
When you're developing a Next.js app and use next dev to run it:

Hot Reloading: Every time you make changes, Next.js reloads your app.
PrismaClient Problem:
Each reload creates a new instance of PrismaClient, which connects to your database.
This quickly uses up all the allowed database connections because each PrismaClient has its own connection pool.
Solution
To solve this, we use a singleton pattern to ensure that only one instance of PrismaClient is created and reused during development.



*/
