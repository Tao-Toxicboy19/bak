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
exports.deleteNoti = exports.deleteMainTainFTS = exports.putMainTainFTS = exports.postMainTainFTS = exports.getMainTainFTSById = exports.getMainTainFTS = exports.deleteMainTainCrane = exports.putMainTainCrane = exports.postMainTainCrane = exports.getMainTainCraneById = exports.getMainTainCrane = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getMainTainCrane = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = +req.params.group;
        const mainTainCrane = yield prisma.maintain_crane.findMany({
            // where: {
            //     group: id
            // },
            include: {
                crane: true
            }
        });
        return res.json(mainTainCrane);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
    }
});
exports.getMainTainCrane = getMainTainCrane;
const getMainTainCraneById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const mainTainCrane = yield prisma.maintain_crane.findUnique({
            where: { maintain_crane_id: id },
            include: {
                crane: true,
            },
        });
        if (mainTainCrane) {
            return res.json(mainTainCrane);
        }
        else {
            return res.status(404).json({ error: "Maintenance Crane not found" });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred" });
    }
});
exports.getMainTainCraneById = getMainTainCraneById;
const postMainTainCrane = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, desc, downtime, start_time, mt_crane_id, noti_day } = req.body;
        const newMainTainCrane = yield prisma.maintain_crane.create({
            data: {
                noti_day: +noti_day,
                desc,
                downtime,
                start_time,
                mt_crane_id: +mt_crane_id,
                group: id
            },
        });
        return res.json({ message: "OK", result: newMainTainCrane });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred" });
    }
});
exports.postMainTainCrane = postMainTainCrane;
const putMainTainCrane = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const { desc, downtime, start_time, mt_crane_id, noti_day } = req.body;
        const newMainTainFTS = yield prisma.maintain_crane.update({
            where: { maintain_crane_id: id },
            data: {
                noti_day: +noti_day,
                desc,
                downtime,
                start_time,
                mt_crane_id: +mt_crane_id,
            }
        });
        return res.json(newMainTainFTS);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
    }
});
exports.putMainTainCrane = putMainTainCrane;
const deleteMainTainCrane = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const deletedMainTainCrane = yield prisma.maintain_crane.delete({
            where: { maintain_crane_id: id },
        });
        return res.json({ message: "Deleted", result: deletedMainTainCrane });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred" });
    }
});
exports.deleteMainTainCrane = deleteMainTainCrane;
const getMainTainFTS = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = +req.params.group;
        const mainTainFTS = yield prisma.maintain_fts.findMany({
            // where:{
            //     group:id
            // },
            include: {
                fts: true
            }
        });
        return res.json(mainTainFTS);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
    }
});
exports.getMainTainFTS = getMainTainFTS;
const getMainTainFTSById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const result = yield prisma.maintain_fts.findUnique({
            where: { maintain_FTS_id: id },
            include: {
                fts: true
            }
        });
        return res.json(result);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
    }
});
exports.getMainTainFTSById = getMainTainFTSById;
const postMainTainFTS = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, desc_FTS, downtime_FTS, start_time_FTS, mt_FTS_id, noti_day } = req.body;
        const mainTainFTS = yield prisma.maintain_fts.create({
            data: {
                noti_day: +noti_day,
                desc_FTS,
                downtime_FTS,
                start_time_FTS,
                mt_FTS_id: +mt_FTS_id,
                group: id
            },
        });
        return res.json({ message: "ok", result: mainTainFTS });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred" });
    }
});
exports.postMainTainFTS = postMainTainFTS;
const putMainTainFTS = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const { desc_FTS, downtime_FTS, start_time_FTS, mt_FTS_id, noti_day } = req.body;
        const newMainTainFTS = yield prisma.maintain_fts.update({
            where: { maintain_FTS_id: id },
            data: {
                noti_day: +noti_day,
                desc_FTS,
                downtime_FTS,
                start_time_FTS,
                mt_FTS_id: +mt_FTS_id,
            }
        });
        return res.json(newMainTainFTS);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
    }
});
exports.putMainTainFTS = putMainTainFTS;
const deleteMainTainFTS = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const deletedMainTainFTS = yield prisma.maintain_fts.delete({
            where: { maintain_FTS_id: id },
        });
        return res.json({ message: "Deleted", result: deletedMainTainFTS });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred" });
    }
});
exports.deleteMainTainFTS = deleteMainTainFTS;
const deleteNoti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, id } = req.body;
        if (type === 'fts') {
            console.log('hello fts');
            yield prisma.maintain_fts.update({
                where: {
                    maintain_FTS_id: id
                },
                data: {
                    noti: true
                }
            });
        }
        if (type === 'crane') {
            console.log('hello crane');
            yield prisma.maintain_crane.update({
                where: {
                    maintain_crane_id: id
                },
                data: {
                    noti: true
                }
            });
        }
        return res.json({ message: 'OK' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred" });
    }
});
exports.deleteNoti = deleteNoti;
