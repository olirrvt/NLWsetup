import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";

const app = Fastify();
const prisma = new PrismaClient();
const port = 4030;

app.get('/', async () => {

    const habits = await prisma.habit.findMany({
        where: {
            title: {
                startsWith: 'Beber'
            }
        }
    });

    return habits;
});

app.listen({
    port
}).then(() => {
    console.log(`HTTP Server running: http://localhost:${port}`);
});

