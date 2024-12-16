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
exports.DeleteCarrierController = exports.PutCarrierController = exports.PostCarrierController = exports.GetbyIdCarrier = exports.GetCarrierController = void 0;
const client_1 = require("@prisma/client");
const node_cache_1 = __importDefault(require("node-cache"));
const myCache = new node_cache_1.default();
const prisma = new client_1.PrismaClient();
const GetCarrierController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const carriers = yield prisma.carrier.findMany({});
        const cachedData = myCache.get('carrier');
        if (cachedData) {
            // return res.json(cachedData)
        }
        // ตรวจสอบและแก้ไขค่า has_crane
        const updatedCarriers = carriers.map(carrier => {
            if (carrier.has_crane === "has") {
                carrier.has_crane = "มีเครน";
            }
            else if (carrier.has_crane === "no" || carrier.has_crane === null) {
                carrier.has_crane = "ไม่มีเครน";
            }
            return carrier;
        });
        myCache.set('carrier', carriers, 600);
        return res.json(updatedCarriers);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
    }
});
exports.GetCarrierController = GetCarrierController;
const GetbyIdCarrier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const carrier = yield prisma.carrier.findUnique({
            where: { cr_id: id }
        });
        return res.json(carrier);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
});
exports.GetbyIdCarrier = GetbyIdCarrier;
const PostCarrierController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { carrier_name, holder, maxcapacity, burden, Width, carrier_max_FTS, carrier_max_crane, length, has_crane } = req.body;
        const carrier = yield prisma.carrier.create({
            data: {
                carrier_name, holder, maxcapacity, burden, Width, carrier_max_FTS, carrier_max_crane, length, has_crane
            }
        });
        const cachedData = myCache.get('cargo');
        if (cachedData) {
            myCache.del('cargo');
        }
        return res.json({ message: 'OK', carrier });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
    }
});
exports.PostCarrierController = PostCarrierController;
const PutCarrierController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const { carrier_name, holder, maxcapacity, burden, Width, carrier_max_FTS, carrier_max_crane, length, has_crane } = req.body;
        const updatedCarrier = yield prisma.carrier.update({
            where: { cr_id: id },
            data: {
                carrier_name, holder, maxcapacity, burden, Width, carrier_max_FTS, carrier_max_crane, length, has_crane
            }
        });
        const cachedData = myCache.get('cargo');
        if (cachedData) {
            myCache.del('cargo');
        }
        res.json(updatedCarrier);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
    }
});
exports.PutCarrierController = PutCarrierController;
const DeleteCarrierController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const deleteCarrier = yield prisma.carrier.delete({
            where: { cr_id: id }
        });
        const cachedData = myCache.get('cargo');
        if (cachedData) {
            myCache.del('cargo');
        }
        return res.json({ message: 'OK' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
    }
});
exports.DeleteCarrierController = DeleteCarrierController;
