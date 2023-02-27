import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
    // Ver no terminal as query feitas no DB
    log: ['query']
});