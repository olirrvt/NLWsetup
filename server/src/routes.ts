// Para a tipagem do TypeScript
import { FastifyInstance } from 'fastify';
// DayJS
import dayjs from 'dayjs';
// Zod
import {z} from 'zod';
// Conection DB
import { prisma } from './lib/prisma';

export async function appRoutes(app: FastifyInstance) {

    app.post('/habits', async (req) => {
        
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

    app.patch('/habits/:id/toggle', async (req) => {
        // Route params => Parâmetro de identificação.

        const toggleHabitParams = z.object({
            id: z.string().uuid(),
        });

        const { id } = toggleHabitParams.parse(req.params);

        const today = dayjs().startOf('day').toDate();

        let day = await prisma.day.findUnique({
            where: {
                date: today,
            }
        });

        if (!day) {
            day = await prisma.day.create({
                data: {
                    date: today,
                }
            });
        };

        const dayHabit = await prisma.dayHabit.findUnique({
            where: {
                day_id_habit_id: {
                    day_id: day.id,
                    habit_id: id,
                }
            }
        });

        // Remover a marcação de completo
        if (dayHabit) {
            await prisma.dayHabit.delete({
                where: {
                    id: dayHabit.id,
                }
            })
        } else {
            // Completar o Hábito
            await prisma.dayHabit.create({
                data: {
                    day_id: day.id,
                    habit_id: id,
                }
            });
        };
    });

    app.get('/summary', async (req) => {

        // [{ data: 10/03, amount: 5, completed: 1 }, { date: 11/03, amount: }]
        // Prisma ORM = RAW SQL => SQLite
        // Query mais complexa, mais condições, relacionamentos => SQL na mão (RAW)

        const summary = await prisma.$queryRaw`
            SELECT 
            D.id, 
            D.date,
            (
                SELECT 
                cast(count(*) as float)
                FROM day_habits DH
                WHERE DH.day_id = D.id
            ) as completed,
            (
                SELECT
                cast(count(*) as float)
                FROM habit_week_days HWD
                JOIN habits H
                    ON H.id = HWD.habit_id
                WHERE
                  HWD.week_day = cast(strftime('%w', D.date / 1000.0, 'unixepoch') as int)
                  AND H.created_at <= D.date
            ) as amount
            FROM days D
        `

        // Epoch Time Stamp => 

        return summary;
    });

};
