import { Request, Response } from "express";
import moment from 'moment';
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();
import { v4 as uuidv4 } from 'uuid'

export const crane_solutionV2 = async (req: Request, res: Response) => {
    try {
        const id = +req.params.id
        // const resutl = await prisma.$queryRaw`
        //     SELECT * FROM crane_solution
        // `
        const result = await prisma.crane_solution.findMany({
            where: { solution_id: id }
        })

        return res.json(result)

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
    }
}

export const tableTotal = async (req: Request, res: Response) => {
    try {
        type crane_solution = {
            FTS_id: number;
            total_cost_sum: number;
            total_consumption_cost_sum: number;
            penality_cost_sum: number;
            total_all_costs_sum: number;
            FTS_name: string;
            total_reward_sum: number;
        }

        type Crane = {
            FTS_id: number;
            premium_rate_sum: number;
        }

        const id = +req.params.id
        const result: crane_solution[] = await prisma.$queryRaw`
        SELECT
            crane_solution.FTS_id,
            ROUND(
                SUM(crane.wage_month_cost),
                2
            ) AS total_cost_sum,
            ROUND(
                SUM(
                    crane_solution.total_consumption_cost * 35
                ),
                2
            ) AS total_consumption_cost_sum,
            ROUND(
                SUM(crane_solution.penality_cost),
                2
            ) AS penality_cost_sum,
            ROUND(
                SUM(
                    crane_solution.penality_cost + crane_solution.total_consumption_cost + crane_solution.total_cost
                ),
                2
            ) AS total_all_costs_sum,
            fts.FTS_name,
            ROUND(
                SUM(crane_solution.total_reward),
                2
            ) AS total_reward_sum
        FROM
            crane_solution
        JOIN fts ON fts.id = crane_solution.FTS_id
        JOIN crane ON crane.id = crane_solution.crane_id
        
        WHERE
            crane_solution.solution_id = ${id}
        GROUP BY
            crane_solution.FTS_id,
            fts.FTS_name;
        `

        const crane: Crane[] = await prisma.$queryRaw`
            SELECT
                crane.FTS_id,
                ROUND(
                    SUM(
                        load_cargo * cargo.premium_rate
                    ),
                    2
                ) AS premium_rate_sum
            FROM
                solution_crane_schedule
            JOIN cargo ON solution_crane_schedule.cargo_id = cargo.cargo_id
            JOIN crane ON crane.id = solution_crane_schedule.crane_id
            WHERE
                solution_crane_schedule.solution_id = ${id}
            GROUP BY
                crane.FTS_id;
        `

        const combinedResult = result.map(item => ({
            ...item,
            // total_cost: crane.find(c => c.id === item.crane_id)?.premium_rate_sum !== undefined 
            // ? item.total_cost + crane.find(c => c.id === item.crane_id)?.premium_rate_sum || 0 
            // : item.total_cost
            // total_cost_sum: item.total_cost_sum + crane.find(c => c.FTS_id === item.FTS_id)?.premium_rate_sum || 0,
            total_cost_sum: crane.find(c => c.FTS_id === item.FTS_id)?.premium_rate_sum !== undefined
                ? item.total_cost_sum + crane.find(c => c.FTS_id === item.FTS_id)?.premium_rate_sum || 0
                : item.total_cost_sum
            ,
            total_cost: item.total_cost_sum,
            premium_rate_sum: crane.find(c => c.FTS_id === item.FTS_id)?.premium_rate_sum || 0
            // premium_rate_sum: crane.find(c => c.FTS_id === item.FTS_id)?.premium_rate_sum !== undefined
            //     ? item.total_cost_sum + crane.find(c => c.FTS_id === item.FTS_id)?.premium_rate_sum || 0
            //     : item.total_cost_sum
            // ,
        }));

        return res.json(combinedResult);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
    }
}

export const solutionCrane = async (req: Request, res: Response) => {
    type crane_solution = {
        crane_id: number;
        total_cost: number;
        total_consumption_cost: number;
        penality_cost: number;
        total_all_costs: number;
        crane_name: string;
        total_reward_costs: number;
    }
    type Crane = {
        id: number;
        crane_name: string;
        premium_rate_sum: number;
    }


    try {
        const id = +req.params.id
        const result: crane_solution[] = await prisma.$queryRaw`
        SELECT
            crane_solution.crane_id,
            crane_solution.FTS_id,

        ROUND(
                SUM(crane.wage_month_cost),
                2
            ) AS total_cost,
            ROUND(
                SUM(
                    crane_solution.total_consumption_cost * 35
                ),
                2
            ) AS total_consumption_cost,
            ROUND(
                SUM(crane_solution.penality_cost),
                2
            ) AS penality_cost,
            ROUND(
                SUM(
                    crane_solution.penality_cost + crane_solution.total_consumption_cost + crane_solution.total_cost
                ),
                2
            ) AS total_all_costs,
            crane.crane_name,
            ROUND(
                SUM(
                    crane_solution.total_reward
                ),
                2
            ) AS total_reward_costs
        FROM
            crane_solution
        JOIN crane ON crane.id = crane_solution.crane_id 
        WHERE
            crane_solution.solution_id = ${id}
        GROUP BY
            crane.crane_name
        `
        const crane: Crane[] = await prisma.$queryRaw`
            SELECT
                crane.id,
                crane.crane_name,
                crane.FTS_id,
                ROUND(
                    SUM(
                        load_cargo * cargo.premium_rate
                    ),
                    2
                ) AS premium_rate_sum
            FROM
                solution_crane_schedule
            JOIN cargo ON solution_crane_schedule.cargo_id = cargo.cargo_id
            JOIN crane ON crane.id = solution_crane_schedule.crane_id
            WHERE
                solution_crane_schedule.solution_id = ${id}
            GROUP BY
                crane.id;
        `
        const combinedResult = result.map(item => ({
            ...item,
            // total_cost_sum: item.total_cost + crane.find(c => c.id === item.crane_id)?.premium_rate_sum || 0,
            // total_cost: item.total_cost,
            // premium_rate_sum: crane.find(c => c.id === item.crane_id)?.premium_rate_sum || 0,
            total_cost: crane.find(c => c.id === item.crane_id)?.premium_rate_sum !== undefined
                ? item.total_cost + crane.find(c => c.id === item.crane_id)?.premium_rate_sum || 0
                : item.total_cost
        }))

        return res.json(combinedResult)

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
    }
}

// export const solution_schedule = (req: Request, res: Response) => {
//     const { id } = req.params
//     const sql = `
//     SELECT
//         solution_schedule.lat,
//         solution_schedule.lng,
//         carrier.carrier_name,
//         arrivaltime,
//         exittime,
//         operation_time,
//         operation_rate,
//         Setup_time,
//         travel_Distance,
//         travel_time,
//         fts.FTS_name
//     FROM
//         solution_schedule
//     LEFT JOIN fts ON solution_schedule.FTS_id = fts.id
//     LEFT JOIN carrier ON solution_schedule.carrier_id = carrier.cr_id

//     WHERE solution_schedule.FTS_id = ?

//     `;

//     connection.query(sql, [id], (err, result) => {
//         if (err) {
//             return res.json({ Message: `Error in Node ${err}` });
//         }
//         const formattedResult = result.map((item) => ({
//             ...item,
//             arrivaltime: new Date(item.arrivaltime).toLocaleString(),
//             exittime: new Date(item.exittime).toLocaleString(),
//         }));

//         return res.json(formattedResult);
//     });
// }


export const craneTable = async (req: Request, res: Response) => {

    type crane_solution = {
        crane_id: number;
        total_cost: number;
        total_consumption_cost: number;
        penality_cost: number;
        total_all_costs: number;
        crane_name: string;
        total_reward_costs: number;
        id: number
    }
    type Crane = {
        id: number;
        crane_name: string;
        premium_rate: number;
    }


    try {
        const id = +req.params.id
        const result: crane_solution[] = await prisma.$queryRaw`
            SELECT
                crane_solution.crane_id,
                ROUND(SUM(crane.wage_month_cost),
                2) AS total_cost,
                ROUND(
                    SUM(
                        crane_solution.total_consumption_cost * 35
                    ),
                    2
                ) AS total_consumption_cost,
                ROUND(
                    SUM(crane_solution.penality_cost),
                    2
                ) AS penality_cost,
                ROUND(
                    SUM(
                        crane_solution.penality_cost + crane_solution.total_consumption_cost + crane_solution.total_cost
                    ),
                    2
                ) AS total_all_costs,
                crane.crane_name,
                ROUND(
                    SUM(crane_solution.total_reward),
                    2
                ) AS total_reward_costs,
                fts.id
            FROM
                crane_solution
            JOIN crane ON crane.id = crane_solution.crane_id
            JOIN fts ON fts.id = crane_solution.FTS_id
            WHERE
                crane_solution.solution_id = ${id}
            GROUP BY
                crane.crane_name
            `

        const crane: Crane[] = await prisma.$queryRaw`
            SELECT
                crane.id,
                crane.crane_name,
                cargo.premium_rate
            FROM
                solution_crane_schedule
            JOIN cargo ON solution_crane_schedule.cargo_id = cargo.cargo_id
            JOIN crane ON crane.id = solution_crane_schedule.crane_id
            WHERE
                solution_crane_schedule.solution_id = ${id}
            GROUP BY
                crane.crane_name;
            `

        const combinedResult = result.map(item => {
            const craneItem = crane.find(c => c.id === item.crane_id);
            const premiumRateSum = craneItem ? craneItem.premium_rate : 0;

            const totalCost = craneItem && craneItem.premium_rate !== 0 ? item.total_cost * craneItem.premium_rate : item.total_cost;

            return {
                ...item,
                total_cost: totalCost,
                premiumRateSum
            };
        });

        return res.json(combinedResult)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
    }
}

const convertDate = (date) => {
    const startTimeWithoutT = date.replace("T", " ");
    const startTimeZ = startTimeWithoutT.replace(".000Z", "");
    const parts = startTimeZ.split(" ");
    const dateParts = parts[0].split("-");
    const swappedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
    const time = parts[1];

    return `${swappedDate} ${time}`;
};

export const solution_schedule = async (req: Request, res: Response) => {

    const id = +req.params.id
    const result: any = await prisma.$queryRaw`
        SELECT
            solution_schedule.*,
            fts.FTS_name,
            carrier.*
        FROM
            solution_schedule
        LEFT JOIN fts ON solution_schedule.FTS_id = fts.id
        LEFT JOIN carrier ON solution_schedule.carrier_id = carrier.cr_id
        WHERE
            solution_schedule.solution_id = ${id};
    `;

    const formattedResult = result.map((item) => {
        const startTimeISO = new Date(item.arrivaltime.toString()).toISOString()
        const endTimeISO = new Date(item.exittime.toString()).toISOString()
        const startTimeSwapped = convertDate(startTimeISO)
        const endTimeSwapped = convertDate(endTimeISO)

        return {
            ...item,
            arrivaltime: startTimeSwapped,
            exittime: endTimeSwapped
        }
    });

    return res.json(formattedResult)
}


export const report_solution = async (req: Request, res: Response) => {
    const id = +req.params.id;
    try {
        const result: any = await prisma.$queryRaw`
        SELECT
            fts.FTS_name,
            carrier.carrier_name,
            MIN(solution_crane_schedule.start_time) AS min_start_time,
            MAX(solution_crane_schedule.due_time) AS max_due_time,
            SUM(solution_crane_schedule.load_cargo) AS total_load_cargo
        FROM
            solution_crane_schedule
        JOIN carrier ON solution_crane_schedule.carrier_id = carrier.cr_id
        JOIN crane ON solution_crane_schedule.crane_id = crane.id
        JOIN fts ON fts.id = crane.FTS_id
        WHERE
            solution_crane_schedule.solution_id = ${id}
        GROUP BY
            fts.FTS_name,
            carrier.carrier_name;
        `

        return res.json(result)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const report_solution_crane = async (req: Request, res: Response) => {
    const id = +req.params.id;
    try {
        const result: any = await prisma.$queryRaw`
            SELECT
                *
            FROM
                solution_crane_schedule
            JOIN carrier ON solution_crane_schedule.carrier_id = carrier.cr_id
            JOIN crane ON solution_crane_schedule.crane_id = crane.id
            JOIN fts ON crane.FTS_id = fts.id
            JOIN cargo ON solution_crane_schedule.cargo_id = cargo.cargo_id
            WHERE
                solution_crane_schedule.solution_id = ${id};
        `;

        const formattedResult = result.map(row => {
            return {
                ...row,
                start_time: moment(row.start_time).format('YYYY-MM-DD HH:mm:ss'),
                due_time: moment(row.due_time).format('YYYY-MM-DD HH:mm:ss'),
            };
        });

        return res.json(formattedResult);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const solution_carrier_order = async (req: Request, res: Response) => {
    const id = +req.params.id
    const result: any = await prisma.$queryRaw`
        SELECT
            *
        FROM
            solution_carrier_order
        JOIN carrier_order ON solution_carrier_order.order_id = carrier_order.or_id
        JOIN carrier ON carrier_order.cr_id = carrier.cr_id
        WHERE
            solution_carrier_order.s_id = ${id};

    `
    return res.json(result);
}


export const solution_carrier_orderSum = async (req: Request, res: Response) => {
    try {
        const solution_carrier_order = await prisma.solution_carrier_order.findMany({
            select: {
                s_id: true,
                order_id: true,
                penalty_cost: true,
                reward: true,
            },
        });

        return res.json(solution_carrier_order);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
    }
}

export const totalCost = async (req: Request, res: Response) => {
    try {
        const cost: any = await prisma.$queryRaw`
            SELECT
                *
            FROM
                solution_crane_schedule
            JOIN carrier ON solution_crane_schedule.carrier_id = carrier.cr_id
            JOIN crane ON solution_crane_schedule.crane_id = crane.id
            JOIN fts ON crane.FTS_id = fts.id
            JOIN cargo ON solution_crane_schedule.cargo_id = cargo.cargo_id
        `

        const modifiedCost = cost.map(item => ({
            ...item,
            total_cost: item.load_cargo * item.premium_rate + item.wage_month_cost
        }));

        return res.json(modifiedCost)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
    }
}

export const createPlan = async (req: Request, res: Response) => {
    try {
        const { Group, ended, started, plan_name, plan_id, plan_type } = req.body

        console.log(plan_id)
        if (plan_id) {
            const existng = await prisma.solutions.findUnique({ where: { id: plan_id } })
            if (existng) {
                await prisma.solutions.update({
                    where: { id: plan_id },
                    data: {
                        plan_name: `old_${existng.plan_name}`
                    }
                })
            }
        }
        const result = await prisma.solutions.create({
            data: {
                created_at: new Date(),
                user_group: Group,
                started_at: started,
                ended_at: ended,
                plan_name,
                plan_type,
            }
        })
        res.json({ message: result.id })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
    }
}

export const getPlan = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const plan = await prisma.solutions.findMany({
            where: { user_group: +id }
        })

        return res.json(plan)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
    }
}

export const removePlan = async (req: Request, res: Response) => {
    try {
        const { id, plan_id } = req.body
        if (plan_id) {
            const existng = await prisma.solutions.findUnique({ where: { id: plan_id } })
            if (existng) {
                await prisma.$transaction([
                    prisma.crane_solution.deleteMany({ where: { solution_id: existng.id } }),
                    prisma.solution_schedule.deleteMany({ where: { solution_id: existng.id } }),
                    prisma.solution_crane_schedule.deleteMany({ where: { solution_id: existng.id } }),
                    prisma.solution_carrier_order.deleteMany({ where: { s_id: existng.id } }),
                    prisma.solutions.deleteMany({ where: { id: existng.id } }),
                ])
            }
        }
        if (id) {
            await prisma.$transaction([
                prisma.crane_solution.deleteMany({ where: { solution_id: id } }),
                prisma.solution_schedule.deleteMany({ where: { solution_id: id } }),
                prisma.solution_crane_schedule.deleteMany({ where: { solution_id: id } }),
                prisma.solution_carrier_order.deleteMany({ where: { s_id: id } }),
                prisma.solutions.deleteMany({ where: { id } }),
            ])
        }

        return res.json({ message: 'OK' })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
    }
}