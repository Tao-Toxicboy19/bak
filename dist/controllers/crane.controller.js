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
exports.CraneDelete = exports.GetByIdCrane = exports.UpdateCrane = exports.createCrane = exports.GetCrane = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const GetCrane = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resutlt = yield prisma.crane.findMany();
        return res.json(resutlt);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
});
exports.GetCrane = GetCrane;
const createCrane = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { crane_name, FTS_id, setuptime_crane, wage_month_cost } = req.body;
        const createCrane = yield prisma.crane.create({
            data: {
                crane_name,
                FTS_id,
                setuptime_crane: +setuptime_crane,
                wage_month_cost: +wage_month_cost,
            }
        });
        return res.json(createCrane);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
});
exports.createCrane = createCrane;
const UpdateCrane = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const { crane_name, FTS_id, setuptime_crane, wage_month_cost } = req.body;
        const updateCrane = yield prisma.crane.update({
            where: {
                id: id
            },
            data: {
                crane_name, FTS_id, setuptime_crane, wage_month_cost
            }
        });
        return res.json(updateCrane);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
});
exports.UpdateCrane = UpdateCrane;
const GetByIdCrane = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const craneId = req.params.id;
    const result = yield prisma.crane.findUnique({
        where: {
            id: +craneId
        }
    });
    return res.json(result);
});
exports.GetByIdCrane = GetByIdCrane;
const CraneDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield prisma.crane.delete({
        where: { id }
    });
    return res.json({ message: 'ลบรถเครนเรียบร้อยแล้ว' });
});
exports.CraneDelete = CraneDelete;
