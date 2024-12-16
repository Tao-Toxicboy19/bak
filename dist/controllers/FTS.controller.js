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
exports.DeleteFTSController = exports.UpdateFTSController = exports.PostFTSController = exports.GetByIdFTS = exports.GetFTSController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const GetFTSController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prisma.$queryRaw `
        SELECT
                fts.id AS fts_id,
                fts.FTS_name,
                fts.lat,
                fts.lng,
                fts.setuptime_FTS,
                fts.speed,
                COALESCE(crane.crane_name, NULL) AS crane_name,
                crane.id AS crane_id,
                crane.setuptime_crane,
                crane.wage_month_cost
            FROM
                fts
            LEFT JOIN crane ON fts.id = crane.FTS_id;
        `;
        const formattedResult = [];
        for (const row of result) {
            const existingItem = formattedResult.find((accItem) => accItem.FTS_name === row.FTS_name);
            if (existingItem) {
                existingItem.result.push({
                    crane_id: row.crane_id,
                    crane_name: row.crane_name,
                    setuptime_crane: row.setuptime_crane,
                    wage_month_cost: row.wage_month_cost,
                });
            }
            else {
                formattedResult.push({
                    fts_id: row.fts_id,
                    FTS_name: row.FTS_name,
                    lat: row.lat,
                    lng: row.lng,
                    setuptime_FTS: row.setuptime_FTS,
                    speed: row.speed,
                    result: [{
                            crane_id: row.crane_id,
                            crane_name: row.crane_name,
                            setuptime_crane: row.setuptime_crane,
                            wage_month_cost: row.wage_month_cost,
                        }],
                });
            }
        }
        return res.json(formattedResult);
        // connection.query(sql, (err, result) => {
        //     if (err) {
        //         return res.json({ Message: `Error in Node ${err}` });
        //     }
        //     const formattedResult = [];
        //     for (const row of result) {
        //         const existingItem = formattedResult.find((accItem) => accItem.FTS_name === row.FTS_name);
        //         if (existingItem) {
        //             existingItem.result.push({
        //                 crane_id: row.crane_id,
        //                 crane_name: row.crane_name,
        //                 setuptime_crane: row.setuptime_crane,
        //                 wage_month_cost: row.wage_month_cost,
        //             });
        //         } else {
        //             formattedResult.push({
        //                 fts_id: row.fts_id,
        //                 FTS_name: row.FTS_name,
        //                 lat: row.lat,
        //                 lng: row.lng,
        //                 setuptime_FTS: row.setuptime_FTS,
        //                 speed: row.speed,
        //                 result: [{
        //                     crane_id: row.crane_id,
        //                     crane_name: row.crane_name,
        //                     setuptime_crane: row.setuptime_crane,
        //                     wage_month_cost: row.wage_month_cost,
        //                 }],
        //             });
        //         }
        //     }
        //     return res.json(formattedResult);
        // });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
    }
});
exports.GetFTSController = GetFTSController;
const GetByIdFTS = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield prisma.fts.findUnique({
        where: { id: +id }
    });
    return res.json(result);
});
exports.GetByIdFTS = GetByIdFTS;
const PostFTSController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { FTS_name, lat, lng, setuptime_FTS, speed } = req.body;
    const result = yield prisma.fts.create({
        data: {
            FTS_name, lat, lng, setuptime_FTS, speed
        }
    });
    return res.json(result);
    // const sql = `
    //     INSERT INTO fts (FTS_name, lat, lng, setuptime_FTS, speed)
    //     VALUES (?, ?, ?, ?, ?)
    // `;
    // connection.query(sql, [FTS_name, lat, lng, setuptime_FTS, speed], (err, result) => {
    //     if (err) {
    //         console.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูล:', err);
    //         res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเพิ่มข้อมูล' + err });
    //     } else {
    //         console.log('เพิ่มข้อมูลใหม่ลงในฐานข้อมูลสำเร็จ');
    //         res.json({ success: 'เพิ่มทุ่นเรียบร้อย' });
    //     }
    // });
});
exports.PostFTSController = PostFTSController;
const UpdateFTSController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const { FTS_name, lat, lng, setuptime_FTS, speed } = req.body;
        const updateCrane = yield prisma.fts.update({
            where: {
                id: +id
            },
            data: {
                FTS_name, lat, lng, setuptime_FTS, speed
            }
        });
        return res.json(updateCrane);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred" });
    }
});
exports.UpdateFTSController = UpdateFTSController;
const DeleteFTSController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        yield prisma.crane.deleteMany({
            where: {
                FTS_id: +id,
            },
        });
        yield prisma.fts.delete({
            where: {
                id: +id,
            },
        });
        return res.json({ message: "FTS and related data deleted successfully." });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred" });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.DeleteFTSController = DeleteFTSController;
