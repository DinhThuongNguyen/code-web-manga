import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export function createContext(req)  {
  return {
    ...req,
    prisma
  }
}