import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GetFTSController = async (req: Request, res: Response) => {
    try {
        const result: any = await prisma.$queryRaw`
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
        `
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
            } else {
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
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "An error occurred" });
    }
}


export const GetByIdFTS = async (req, res) => {
    const id = req.params.id;
    const result = await prisma.fts.findUnique({
        where: { id: +id }
    })
    return res.json(result);
}

export const PostFTSController = async (req, res) => {
    const { FTS_name, lat, lng, setuptime_FTS, speed } = req.body;
    const result = await prisma.fts.create({
        data: {
            FTS_name, lat, lng, setuptime_FTS, speed
        }
    })
    return res.json(result)
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
}


export const UpdateFTSController = async (req: Request, res: Response) => {
    try {
        const id = req.params.id

        const { FTS_name, lat, lng, setuptime_FTS, speed } = req.body
        const updateCrane = await prisma.fts.update({
            where: {
                id: +id
            },
            data: {
                FTS_name, lat, lng, setuptime_FTS, speed
            }
        })
        return res.json(updateCrane);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred" });
    }
}

export const DeleteFTSController = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);

        await prisma.crane.deleteMany({
            where: {
                FTS_id: +id,
            },
        });

        await prisma.fts.delete({
            where: {
                id: +id,
            },
        });

        return res.json({ message: "FTS and related data deleted successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred" });
    } finally {
        await prisma.$disconnect();
    }
};
