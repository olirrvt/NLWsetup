// Para a tipagem do TypeScript
import { FastifyInstance } from 'fastify';
// DayJS
import dayjs from 'dayjs';
// Zod
import {z} from 'zod';
// Conection DB
import { prisma } from './lib/prisma';

export async function appRoutes(app: FastifyInstance) {

    /* 
        Request =>
        Body: Corpo da Requisição
        Params: Parametros das Rotas
        Query: Filtros depois da "?" 
    */

    app.post('/habits', async (req, res) => {
        
        // Tipagem para o TypeScript e validação
        // Utilizando a biblioteca Zod
        const createHabitBody = z.object({
            title: z.string(),
            weekDays: z.array(
                z.number().min(0).max(6)
            )
        });

        // Corpo da Requisição
        const { title, weekDays } = createHabitBody.parse(req.body);

        const today = dayjs().startOf('day').toDate();

        await prisma.habit.create({
            data: {
                title,
                created_at: today,
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

    app.get('/day', async (req) => {

        const getDayParams = z.object({
            // Converte string parametro para data = "Coerce".
            date: z.coerce.date()
        });

        const { date } = getDayParams.parse(req.query);

        const parsedDate = dayjs(date).startOf('day');
        const weekDay = parsedDate.get('day');

        // Todos os hábitos possíveis
        // E hábitos que já foram completados
        const possibleHabits = await prisma.habit.findMany({
            where: {
                created_at: {
                    lte: date,
                },
                weekDays: {
                    some: {
                        week_day: weekDay,
                    }
                }
            }
        });

        const day = await prisma.day.findUnique({
            where: {
                date: parsedDate.toDate(),
            },
            include: {
                dayHabits: true
            }
        });
        
        const completedHabits = day?.dayHabits.map( dayHabit => {
            return dayHabit.habit_id
        });
        
        return {
            possibleHabits,
            completedHabits
        };

    });

};
