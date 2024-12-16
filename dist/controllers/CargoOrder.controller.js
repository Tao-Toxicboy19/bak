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
exports.putCargoOrderController = exports.getLastCargoOrderIdController = exports.postCargoOrderController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const postCargoOrderController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { order_id, cargo } = req.body;
        const cargoOrders = yield prisma.cargo_order.createMany({
            data: cargo.map((cargoItem) => ({
                order_id,
                cargo_id: cargoItem.cargo_id,
                load: cargoItem.load,
                bulk: cargoItem.bulk,
            })),
        });
        return res.json({ message: "ok", result: cargoOrders });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred" });
    }
});
exports.postCargoOrderController = postCargoOrderController;
const getLastCargoOrderIdController = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lastCargoOrder = yield prisma.carrier_order.findFirst({
            orderBy: { or_id: 'desc' },
        });
        if (!lastCargoOrder) {
            return res.status(404).json({ error: "No cargo orders found" });
        }
        return res.json({ lastCargoOrderId: lastCargoOrder.or_id });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred" });
    }
});
exports.getLastCargoOrderIdController = getLastCargoOrderIdController;
const putCargoOrderController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { order_id, cargo, bulk_values } = req.body;
        yield prisma.cargo_order.deleteMany({
            where: {
                order_id: order_id,
            },
        });
        const cargoOrders = yield prisma.cargo_order.createMany({
            data: cargo.map((cargoItem, index) => (Object.assign({ order_id, cargo_id: cargoItem.cargo_id, load: cargoItem.load, bulk: cargoItem.bulk }, bulk_values[index]))),
        });
        return res.json({ message: "ok" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred" });
    }
});
exports.putCargoOrderController = putCargoOrderController;
