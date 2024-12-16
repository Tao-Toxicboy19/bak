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
exports.DeleteCargoController = exports.UpdateCargoController = exports.PostCargoController = exports.GetbyId = exports.GetCargoController = void 0;
const client_1 = require("@prisma/client");
const node_cache_1 = __importDefault(require("node-cache"));
const myCache = new node_cache_1.default();
const prisma = new client_1.PrismaClient();
const GetCargoController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cachedData = myCache.get('cargo');
        if (cachedData) {
            return res.json(cachedData);
        }
        const cargo = yield prisma.cargo.findMany();
        myCache.set('cargo', cargo, 600);
        return res.json(cargo);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
    }
});
exports.GetCargoController = GetCargoController;
const GetbyId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const cargo = yield prisma.cargo.findUnique({
            where: { cargo_id: id }
        });
        const cachedData = myCache.get('cargo');
        if (cachedData) {
            myCache.del('cargo');
        }
        if (!cargo) {
            return res.status(404).json({ error: "ไม่พบข้อมูลของ cargo ที่ระบุ" });
        }
        res.json(cargo);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
});
exports.GetbyId = GetbyId;
const PostCargoController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cargo = req.body;
        const newCargoData = cargo.inputs.map((input) => ({
            cargo_name: input.cargo_names,
            premium_rate: +input.premium_rate
        }));
        const newCargo = yield prisma.cargo.createMany({
            data: newCargoData
        });
        const cachedData = myCache.get('cargo');
        if (cachedData) {
            myCache.del('cargo');
        }
        return res.json(newCargo);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการสร้างข้อมูล" });
    }
});
exports.PostCargoController = PostCargoController;
const UpdateCargoController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = +req.params.id;
        const { cargo_name, premium_rate } = req.body;
        const updatedCargo = yield prisma.cargo.update({
            where: { cargo_id: id },
            data: {
                cargo_name,
                premium_rate: +premium_rate
            }
        });
        const cachedData = myCache.get('cargo');
        if (cachedData) {
            myCache.del('cargo');
        }
        res.json(updatedCargo);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
    }
});
exports.UpdateCargoController = UpdateCargoController;
const DeleteCargoController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const deletedCargo = yield prisma.cargo.delete({
            where: { cargo_id: id }
        });
        const cachedData = myCache.get('cargo');
        if (cachedData) {
            myCache.del('cargo');
        }
        res.json(deletedCargo);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบข้อมูล" });
    }
});
exports.DeleteCargoController = DeleteCargoController;
