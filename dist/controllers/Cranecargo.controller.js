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
exports.DeleteCargoCraneController = exports.PutCargoCraneController = exports.PostCargoCraneController = exports.GetbyIdCargoCrane = exports.GetCargoCranesController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const GetCargoCranesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cargoCranes = yield prisma.cargo_crane.findMany({
            include: {
                crane: true,
                fts: true,
                cargo: true,
            }
        });
        return res.json(cargoCranes);
    }
    catch (error) {
        console.log(error);
    }
});
exports.GetCargoCranesController = GetCargoCranesController;
const GetbyIdCargoCrane = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const cargoCrane = yield prisma.cargo_crane.findUnique({
            where: { cargo_crane_id: id }
        });
        return res.json(cargoCrane);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
    }
});
exports.GetbyIdCargoCrane = GetbyIdCargoCrane;
const PostCargoCraneController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        data.inputs.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.cargo_crane.create({
                data: {
                    FTS_id: data.FTS_id,
                    category: data.category,
                    crane_id: item.crane_id,
                    cargo_id: item.cargo_id,
                    consumption_rate: +item.consumption_rate,
                    work_rate: +item.work_rate
                }
            });
        }));
        res.json({ message: 'OK' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.PostCargoCraneController = PostCargoCraneController;
const PutCargoCraneController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const { crane_id, cargo_id, FTS_id, consumption_rate, work_rate, category } = req.body;
        const updatedCargoCrane = yield prisma.cargo_crane.update({
            where: {
                cargo_crane_id: id
            },
            data: {
                crane_id,
                cargo_id,
                FTS_id,
                consumption_rate,
                work_rate,
                category
            }
        });
        res.json(updatedCargoCrane);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.PutCargoCraneController = PutCargoCraneController;
const DeleteCargoCraneController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const deletedCargoCrane = yield prisma.cargo_crane.delete({
            where: {
                cargo_crane_id: id
            }
        });
        res.json({ message: 'OK' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.DeleteCargoCraneController = DeleteCargoCraneController;
