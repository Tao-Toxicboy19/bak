"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePlan = exports.getPlan = exports.createPlan = exports.totalCost = exports.solution_carrier_orderSum = exports.solution_carrier_order = exports.report_solution_crane = exports.report_solution = exports.solution_schedule = exports.craneTable = exports.solutionCrane = exports.tableTotal = exports.crane_solutionV2 = void 0;
const moment_1 = __importDefault(require("moment"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const uuid_1 = require("uuid");
const crane_solutionV2 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = +req.params.id;
        // const resutl = await prisma.$queryRaw`
        //     SELECT * FROM crane_solution
        // `
        const result = yield prisma.crane_solution.findMany({
            where: { solution_id: id }
        });
        return res.json(result);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
    }
});
exports.crane_solutionV2 = crane_solutionV2;
const tableTotal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = +req.params.id;
        const result = yield prisma.$queryRaw `
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
        `;
        const crane = yield prisma.$queryRaw `
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
        `;
        const combinedResult = result.map(item => {
            var _a, _b, _c;
            return (Object.assign(Object.assign({}, item), { 
                // total_cost: crane.find(c => c.id === item.crane_id)?.premium_rate_sum !== undefined 
                // ? item.total_cost + crane.find(c => c.id === item.crane_id)?.premium_rate_sum || 0 
                // : item.total_cost
                // total_cost_sum: item.total_cost_sum + crane.find(c => c.FTS_id === item.FTS_id)?.premium_rate_sum || 0,
                total_cost_sum: ((_a = crane.find(c => c.FTS_id === item.FTS_id)) === null || _a === void 0 ? void 0 : _a.premium_rate_sum) !== undefined
                    ? item.total_cost_sum + ((_b = crane.find(c => c.FTS_id === item.FTS_id)) === null || _b === void 0 ? void 0 : _b.premium_rate_sum) || 0
                    : item.total_cost_sum, total_cost: item.total_cost_sum, premium_rate_sum: ((_c = crane.find(c => c.FTS_id === item.FTS_id)) === null || _c === void 0 ? void 0 : _c.premium_rate_sum) || 0 }));
        });
        return res.json(combinedResult);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
    }
});
exports.tableTotal = tableTotal;
const solutionCrane = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = +req.params.id;
        const result = yield prisma.$queryRaw `
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
        `;
        const crane = yield prisma.$queryRaw `
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
                crane.FTS_id;
        `;
        const combinedResult = result.map(item => {
            var _a, _b;
            return (Object.assign(Object.assign({}, item), { 
                // total_cost_sum: item.total_cost + crane.find(c => c.id === item.crane_id)?.premium_rate_sum || 0,
                // total_cost: item.total_cost,
                // premium_rate_sum: crane.find(c => c.id === item.crane_id)?.premium_rate_sum || 0,
                total_cost: ((_a = crane.find(c => c.id === item.crane_id)) === null || _a === void 0 ? void 0 : _a.premium_rate_sum) !== undefined
                    ? item.total_cost + ((_b = crane.find(c => c.id === item.crane_id)) === null || _b === void 0 ? void 0 : _b.premium_rate_sum) || 0
                    : item.total_cost }));
        });
        return res.json(combinedResult);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
    }
});
exports.solutionCrane = solutionCrane;
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
const craneTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = +req.params.id;
        const result = yield prisma.$queryRaw `
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
            `;
        const crane = yield prisma.$queryRaw `
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
            `;
        const combinedResult = result.map(item => {
            const craneItem = crane.find(c => c.id === item.crane_id);
            const premiumRateSum = craneItem ? craneItem.premium_rate : 0;
            const totalCost = craneItem && craneItem.premium_rate !== 0 ? item.total_cost * craneItem.premium_rate : item.total_cost;
            return Object.assign(Object.assign({}, item), { total_cost: totalCost, premiumRateSum });
        });
        return res.json(combinedResult);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
    }
});
exports.craneTable = craneTable;
const convertDate = (date) => {
    const startTimeWithoutT = date.replace("T", " ");
    const startTimeZ = startTimeWithoutT.replace(".000Z", "");
    const parts = startTimeZ.split(" ");
    const dateParts = parts[0].split("-");
    const swappedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
    const time = parts[1];
    return `${swappedDate} ${time}`;
};
const solution_schedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = +req.params.id;
    const result = yield prisma.$queryRaw `
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
        const startTimeISO = new Date(item.arrivaltime.toString()).toISOString();
        const endTimeISO = new Date(item.exittime.toString()).toISOString();
        const startTimeSwapped = convertDate(startTimeISO);
        const endTimeSwapped = convertDate(endTimeISO);
        return Object.assign(Object.assign({}, item), { arrivaltime: startTimeSwapped, exittime: endTimeSwapped });
    });
    return res.json(formattedResult);
});
exports.solution_schedule = solution_schedule;
const report_solution = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = +req.params.id;
    try {
        const result = yield prisma.$queryRaw `
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
        `;
        return res.json(result);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.report_solution = report_solution;
const report_solution_crane = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = +req.params.id;
    try {
        const result = yield prisma.$queryRaw `
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
            return Object.assign(Object.assign({}, row), { start_time: (0, moment_1.default)(row.start_time).format('YYYY-MM-DD HH:mm:ss'), due_time: (0, moment_1.default)(row.due_time).format('YYYY-MM-DD HH:mm:ss') });
        });
        return res.json(formattedResult);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.report_solution_crane = report_solution_crane;
const solution_carrier_order = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = +req.params.id;
    const result = yield prisma.$queryRaw `
        SELECT
            *
        FROM
            solution_carrier_order
        JOIN carrier_order ON solution_carrier_order.order_id = carrier_order.or_id
        JOIN carrier ON carrier_order.cr_id = carrier.cr_id
        WHERE
            solution_carrier_order.s_id = ${id};

    `;
    return res.json(result);
});
exports.solution_carrier_order = solution_carrier_order;
const solution_carrier_orderSum = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const solution_carrier_order = yield prisma.solution_carrier_order.findMany({
            select: {
                s_id: true,
                order_id: true,
                penalty_cost: true,
                reward: true,
            },
        });
        return res.json(solution_carrier_order);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
    }
});
exports.solution_carrier_orderSum = solution_carrier_orderSum;
const totalCost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cost = yield prisma.$queryRaw `
            SELECT
                *
            FROM
                solution_crane_schedule
            JOIN carrier ON solution_crane_schedule.carrier_id = carrier.cr_id
            JOIN crane ON solution_crane_schedule.crane_id = crane.id
            JOIN fts ON crane.FTS_id = fts.id
            JOIN cargo ON solution_crane_schedule.cargo_id = cargo.cargo_id
        `;
        const modifiedCost = cost.map(item => (Object.assign(Object.assign({}, item), { total_cost: item.load_cargo * item.premium_rate + item.wage_month_cost })));
        return res.json(modifiedCost);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
    }
});
exports.totalCost = totalCost;
const createPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Group, ended, started, plan_name, plan_type } = req.body;
        const existng = yield prisma.solutions.findUnique({ where: { plan_name: plan_name } });
        if (existng) {
            yield prisma.solutions.update({
                where: { plan_name: plan_name },
                data: {
                    plan_name: `old_${plan_name}_${(0, uuid_1.v4)()}`
                }
            });
        }
        const result = yield prisma.solutions.create({
            data: {
                created_at: new Date(),
                user_group: Group,
                started_at: started,
                ended_at: ended,
                plan_name,
                plan_type,
            }
        });
        res.json({ message: result.id });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
    }
});
exports.createPlan = createPlan;
const getPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const plan = yield prisma.solutions.findMany({
            where: { user_group: +id }
        });
        return res.json(plan);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
    }
});
exports.getPlan = getPlan;
const removePlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, plan_id } = req.body;
        if (plan_id) {
            const existng = yield prisma.solutions.findUnique({ where: { id: plan_id } });
            if (existng) {
                yield prisma.$transaction([
                    prisma.crane_solution.deleteMany({ where: { solution_id: existng.id } }),
                    prisma.solution_schedule.deleteMany({ where: { solution_id: existng.id } }),
                    prisma.solution_crane_schedule.deleteMany({ where: { solution_id: existng.id } }),
                    prisma.solution_carrier_order.deleteMany({ where: { s_id: existng.id } }),
                    prisma.solutions.deleteMany({ where: { id: existng.id } }),
                ]);
            }
        }
        else {
            yield prisma.$transaction([
                prisma.crane_solution.deleteMany({ where: { solution_id: id } }),
                prisma.solution_schedule.deleteMany({ where: { solution_id: id } }),
                prisma.solution_crane_schedule.deleteMany({ where: { solution_id: id } }),
                prisma.solution_carrier_order.deleteMany({ where: { s_id: id } }),
                prisma.solutions.deleteMany({ where: { id } }),
            ]);
        }
        return res.json({ message: 'OK' });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
    }
});
exports.removePlan = removePlan;
