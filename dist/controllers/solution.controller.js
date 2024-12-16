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
Object.defineProperty(exports, "__esModule", { value: true });
exports.crane_solution_v2 = exports.cranesolutiontable = exports.ftssolution = exports.cranesolution = exports.FtsSolutionSigle = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const FtsSolutionSigle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const crane_solution = yield prisma.crane_solution.findMany({});
        // สร้างออบเจ็กต์ Map เพื่อเก็บผลลัพธ์
        const resultMap = new Map();
        // วนลูปผ่านข้อมูลและบวกเพิ่มเข้าไปใน resultMap ตาม FTS_id
        crane_solution.forEach(solution => {
            const FTS_id = solution.FTS_id;
            if (resultMap.has(FTS_id)) {
                const existingSolution = resultMap.get(FTS_id);
                existingSolution.total_cost += solution.total_cost;
                existingSolution.total_consumption_cost += solution.total_consumption_cost;
                existingSolution.total_wage_cost += solution.total_wage_cost;
                existingSolution.penality_cost += solution.penality_cost;
                existingSolution.total_reward += solution.total_reward;
                existingSolution.total_late_time += solution.total_late_time;
                existingSolution.total_early_time += solution.total_early_time;
                existingSolution.total_operation_consumption_cost += solution.total_operation_consumption_cost;
                existingSolution.total_operation_time += solution.total_operation_time;
                existingSolution.total_preparation_crane_time += solution.total_preparation_crane_time;
            }
            else {
                resultMap.set(FTS_id, {
                    solution_id: solution.solution_id,
                    FTS_id: solution.FTS_id,
                    total_cost: solution.total_cost,
                    total_consumption_cost: solution.total_consumption_cost,
                    total_wage_cost: solution.total_wage_cost,
                    penality_cost: solution.penality_cost,
                    total_reward: solution.total_reward,
                    total_late_time: solution.total_late_time,
                    total_early_time: solution.total_early_time,
                    total_operation_consumption_cost: solution.total_operation_consumption_cost,
                    total_operation_time: solution.total_operation_time,
                    total_preparation_crane_time: solution.total_preparation_crane_time
                });
            }
        });
        // แปลง resultMap เป็น array และส่งผลลัพธ์ออก
        const resultArray = Array.from(resultMap.values());
        return res.json(resultArray);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
    }
});
exports.FtsSolutionSigle = FtsSolutionSigle;
const cranesolution = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = +req.params.id;
        const crane_solution = yield prisma.crane_solution.findMany({
            where: { solution_id: id }
        });
        return res.json(crane_solution);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
    }
});
exports.cranesolution = cranesolution;
const ftssolution = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = +req.params.id;
        const fts_solution = yield prisma.fts_solution.findMany({
            where: { solution_id: id }
        });
        return res.json(fts_solution);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
    }
});
exports.ftssolution = ftssolution;
const cranesolutiontable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = +req.params.id;
        const cranesolution = yield prisma.crane_solution.findMany({
            where: {
                solution_id: id
            },
            include: {
                fts: true,
                crane: true,
            },
        });
        const ftsSolutionMap = new Map();
        for (const item of cranesolution) {
            const fts_id = item.fts.id;
            if (!ftsSolutionMap.has(fts_id)) {
                ftsSolutionMap.set(fts_id, {
                    fts: {
                        id: item.fts.id,
                        FTS_name: item.fts.FTS_name,
                        lat: item.fts.lat,
                        lng: item.fts.lng,
                        setuptime_FTS: item.fts.setuptime_FTS,
                        speed: item.fts.speed,
                    },
                    crane: [],
                    solutions: [],
                });
            }
            const solutionData = {
                fts_id: item.fts.id,
                solution_id: item.solution_id,
                total_cost: item.total_cost,
                total_consumption_cost: item.total_consumption_cost,
                total_wage_cost: item.total_wage_cost,
                penality_cost: item.penality_cost,
                total_reward: item.total_reward,
                total_late_time: item.total_late_time,
                total_early_time: item.total_early_time,
                total_operation_consumption_cost: item.total_operation_consumption_cost,
                total_operation_time: item.total_operation_time,
                total_preparation_crane_time: item.total_preparation_crane_time,
                date: new Date(item.date).toISOString().split('T')[0],
            };
            ftsSolutionMap.get(fts_id).solutions.push(solutionData);
            const craneData = {
                id: item.crane.id,
                crane_name: item.crane.crane_name,
                setuptime_crane: item.crane.setuptime_crane,
            };
            ftsSolutionMap.get(fts_id).crane.push(craneData);
        }
        const formattedResult = Array.from(ftsSolutionMap.values());
        return res.json(formattedResult);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.cranesolutiontable = cranesolutiontable;
const crane_solution_v2 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const crane_solution = yield prisma.crane_solution.findMany({
            include: {
                crane: true,
                fts: true
            }
        });
        return res.json(crane_solution);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
    }
});
exports.crane_solution_v2 = crane_solution_v2;
