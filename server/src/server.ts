// Fastify Dependencie
import Fastify from "fastify";
// @Fastify/cors dependencie
import cors from "@fastify/cors";
// Function of routes
import { appRoutes } from "./routes";

const app = Fastify();
const port = 4030;

app.register(cors);
app.register(appRoutes);

app.listen({
    port
}).then(() => {
    console.log(`HTTP Server running: http://localhost:${port}`);
});

