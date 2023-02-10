// Para a tipagem do TypeScript
import { FastifyInstance } from 'fastify';
// Zod
import {z} from 'zod';
// Conection DB
import { prisma } from './lib/prisma';

export async function appRoutes(app: FastifyInstance) {

    app.post('/habits', async (req, res) => {
        
        // Tipagem para o TypeScript e validação
        const createHabitBody = z.object({
            title: z.string(),
            weekDays: z.array(
                z.number().min(0).max(6)
            )
        });

        const { title, weekDays } = createHabitBody.parse(req.body);

        await prisma.habit.create({
            data: {
                title,
                created_at: new Date(),
                weekDays: {
                    create: weekDays.map(weekDay => {
                        return {
                            week_day: weekDay,
                        }
                    })
                }
            }
        })
    });

};

/* 
    Request =>
    Body: Corpo da Requisição
    Params: Parametros das Rotas
    Query: Filtros depois da "?" 
*/

