import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import moment from 'moment';
import { parse } from 'csv-parse';
import NodeCache from "node-cache";

const prisma = new PrismaClient();
const myCache = new NodeCache();

export const GetOrderController = async (req: Request, res: Response) => {
    try {
        // const group = req.params.group
        const order = await prisma.carrier_order.findMany({
            // where: { group: +group },
            include: {
                carrier: true,
                cargo_order: {
                    include: {
                        cargo: true,
                        Bulks: true
                    },
                },
            },
        })
        const result = order.map((item) => ({
            ...item,
            arrival_time: new Date(item.arrival_time).toLocaleString(),
            deadline_time: new Date(item.deadline_time).toLocaleString(),
        }));

        // moment(item.start_time, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm:ss')
        return res.json(result)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "An error occurred" });
    }
}

export const getSignOrder = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await prisma.carrier_order.findUnique({
            where: { or_id: id },
            include: {
                carrier: true,
                cargo_order: {
                    include: {
                        cargo: true,
                        Bulks: true
                    },
                },
            },
        });
        return res.json(result);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "An error occurred" });
    }
}

export const PostOrderController = async (req: Request, res: Response) => {
    try {
        const order = req.body;
        const carrierOrderResult = await prisma.carrier_order.create({
            data: {
                cr_id: order.cr_id,
                category: order.category,
                arrival_time: order.arrival_time,
                deadline_time: order.deadline_time,
                latitude: +order.latitude,
                longitude: +order.longitude,
                maxFTS: order.maxFTS,
                penalty_rate: order.penalty_rate,
                reward_rate: order.reward_rate,
                group: order.group,
                w: order.w,
                name_of_agent: order.name_of_agent,
                name_of_consignee: order.name_of_consignee,
                name_of_stevedore: order.name_of_stevedore,
                port_of_discharging_cargo: order.port_of_discharging_cargo,
                quantity_of_cargo: order.quantity_of_cargo,
                name_of_owner: order.name_of_owner,
                name_of_shipper: order.name_of_shipper,
                name_of_surveyots: order.name_of_surveyots,
                port_of_loading_cargo: order.port_of_loading_cargo,
                description_of_cargo: order.description_of_cargo,
                vessel_of_readiness_tendered_and_accepted: order.vessel_of_readiness_tendered_and_accepted
            },
        });

        const orderId = carrierOrderResult.or_id;

        const cargoOrderData = order.inputs.map((cargoItem, _) => {
            return {
                order_id: orderId,
                cargo_id: cargoItem.cargo_names,
                load: order.load,
                bulk: +order.burden,
            };
        });
        console.log(cargoOrderData)
        await prisma.cargo_order.createMany({
            data: cargoOrderData,
        });

        const loadBulkArray = order.bulkArray.map((load_bulk) => ({ load_bulk: +load_bulk }));

        await prisma.bulks.createMany({
            data: loadBulkArray.map((load_bulk) => ({
                group: order.group,
                cargo_orderOrder_id: orderId,
                ...load_bulk,
            })),
        });

        return res.json({ message: "ok" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
    }
}

export const UpdateOrderController = async (req: Request, res: Response) => {
    try {
        const id = +(req.params.id)
        const orders = req.body
        const total = orders.bulkArray.reduce((acc: any, currentValue: any) => acc + parseFloat(currentValue), 0)
        const order = await prisma.carrier_order.update({
            where: { or_id: id },
            data: {
                cr_id: +orders.cr_id,
                category: orders.category,
                maxFTS: orders.maxFTS,
                latitude: +orders.latitude,
                longitude: +orders.longitude,
                arrival_time: orders.arrival_time,
                deadline_time: orders.deadline_time,
                penalty_rate: orders.penalty_rate,
                reward_rate: orders.reward_rate,
                w: orders.w,
                name_of_agent: orders.name_of_agent,
                name_of_consignee: orders.name_of_consignee,
                name_of_stevedore: orders.name_of_stevedore,
                port_of_discharging_cargo: orders.port_of_discharging_cargo,
                quantity_of_cargo: orders.quantity_of_cargo,
                name_of_owner: orders.name_of_owner,
                name_of_shipper: orders.name_of_shipper,
                name_of_surveyots: orders.name_of_surveyots,
                port_of_loading_cargo: orders.port_of_loading_cargo,
                description_of_cargo: orders.description_of_cargo,
                vessel_of_readiness_tendered_and_accepted: orders.vessel_of_readiness_tendered_and_accepted
            }
        })

        const orderId = order.or_id

        await prisma.cargo_order.updateMany({
            where: { order_id: orderId },
            data: {
                cargo_id: +orders.inputs.cargo_names,
                bulk: +orders.burden,
                load: total,
            },
        })

        const loadBulkArray = orders.bulkArray.map((load_bulk) => ({ load_bulk: +load_bulk }))

        const dalete = await prisma.bulks.deleteMany({ where: { cargo_orderOrder_id: orderId } })
        await prisma.bulks.createMany({
            data: loadBulkArray.map((load_bulk) => ({
                cargo_orderOrder_id: orderId,
                ...load_bulk,
            })),
        });

        return res.json({ message: "OK" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "An error occurred" });
    }
}

export const DeleteOrderController = async (req, res) => {
    try {
        const id = +req.params.id
        await prisma.bulks.deleteMany({
            where: {
                cargo_orderOrder_id: id
            }
        })
        await prisma.cargo_order.deleteMany({
            where: {
                order_id: id
            }
        });
        await prisma.solution_carrier_order.deleteMany({
            where: {
                order_id: id
            }
        })
        await prisma.carrier_order.delete({
            where: {
                or_id: id
            }
        });



        res.json({ message: 'OK' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

export const UpdateStatusAssign_order = async (req: Request, res: Response) => {
    try {
        const id = +(req.params.id);
        const { ...otherFields } = req.body;

        // สร้าง array เพื่อเก็บ object ที่จะบันทึกลงในฐานข้อมูล
        const recordsToInsert = [];

        // วน loop ตามจำนวนข้อมูลที่ส่งมา
        for (let i = 1; i <= 4; i++) {
            const formattedStartTime = moment(otherFields[`real_start_time${i}`]).format('YYYY-MM-DD HH:mm:ss');
            const record = {
                order_id: id,
                FTS_id: otherFields[`FTS_id${i}`],
                bulk: parseInt(otherFields[`bulk${i}`], 10),
                start_time: formattedStartTime,
                in_active: false
            };

            // เพิ่ม object ลงใน array
            recordsToInsert.push(record);
        }
        await prisma.assign_order.createMany({
            data: recordsToInsert,
        });

        await prisma.carrier_order.update({
            where: { or_id: id },
            data: {
                status_order: "Assign"
            }
        })

        return res.json('hello');
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
    }
};

export const UpdateStatusApproved_order = async (req: Request, res: Response) => {
    try {
        const id = +(req.params.id);
        const { ...otherFields } = req.body;

        // สร้าง array เพื่อเก็บ object ที่จะบันทึกลงในฐานข้อมูล
        const recordsToInsert = [];

        // วน loop ตามจำนวนข้อมูลที่ส่งมา
        for (let i = 1; i <= 4; i++) {
            const formattedStartTime = moment(otherFields[`real_start_time${i}`]).format('YYYY-MM-DD HH:mm:ss');
            const formattedStartTime2 = moment(otherFields[`real_end_time${i}`]).format('YYYY-MM-DD HH:mm:ss');
            const record = {
                order_id: id,
                FTS_id: otherFields[`FTS_id${i}`],
                bulk: parseInt(otherFields[`bulk${i}`], 10),
                real_start_time: formattedStartTime,
                real_end_time: formattedStartTime2,
            };

            // เพิ่ม object ลงใน array
            recordsToInsert.push(record);
        }

        // ทำการบันทึกลงในฐานข้อมูล (ในที่นี้คือการใช้ prisma.createMany)
        await prisma.approved_order.createMany({
            data: recordsToInsert,
        });

        await prisma.carrier_order.update({
            where: { or_id: id },
            data: {
                status_order: "Approved"
            }
        })

        return res.json('hello');
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
    }
};

export const UpdateStatusOrder = async (req: Request, res: Response) => {
    const id = +(req.params.id);

    try {
        await prisma.$transaction([
            prisma.carrier_order.update({
                where: { or_id: +(id) },
                data: {
                    status_order: "Newer"
                }
            }),
            prisma.assign_order.updateMany({
                where: { order_id: +(id) },
                data: {
                    is_active: true
                }
            }),
            prisma.assign_order.deleteMany({
                where: { order_id: +(id) }
            })
        ]);

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred" });
    }
};

export const statusFTS = async (req: Request, res: Response) => {
    const { craneId, group, bulk, FTS_id, order_id } = req.body
    try {
        const update = await prisma.approved_order.create({
            data: {
                order_id: order_id,
                FTS_id: FTS_id,
                bulk: bulk,
                craneId: craneId,
                group
            }
        })
        return res.json({ "message": "OK" })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred" });
    }
};

export const exportCsvOrders = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const cachedData = myCache.get('export-order')
        if (cachedData) {
            return res.json(cachedData)
        }
        const result: any = await prisma.$queryRaw`
            SELECT
                carrier_order.or_id AS "order_id",
                carrier.carrier_name,
                cargo.cargo_name,
                carrier_order.category,
                carrier_order.arrival_time,
                carrier_order.deadline_time,
                carrier_order.latitude,
                carrier_order.longitude,
                carrier_order.maxFTS,
                cargo_order.load,
                cargo_order.bulk,
                carrier_order.penalty_rate,
                carrier_order.reward_rate,
                bulks.load_bulk,
                bulks.cargo_orderOrder_id,
                orderCount.totalCount,
                carrier_order.w AS "W",
                carrier_order.name_of_vessel AS "NAME OF VESSEL",
                carrier_order.name_of_master AS "NAME OF MASTER",
                carrier_order.name_of_owner AS "NAME OF OWNER",
                carrier_order.name_of_agent AS "NAME OF AGENT",
                carrier_order.name_of_shipper AS "NAME OF SHIPPER",
                carrier_order.name_of_consignee AS "NAME OF CONSIGNEE",
                carrier_order.name_of_surveyots AS "NAME OF SURVEYOTS",
                carrier_order.name_of_stevedore AS "NAME OF STEVEDORE",
                carrier_order.port_of_loading_cargo AS "PORT OF LOADING CARGO",
                carrier_order.port_of_discharging_cargo AS "PORT OF DISCHARGING CARGO",
                carrier_order.description_of_cargo AS "DESCRIPTION OF CARGO",
                carrier_order.quantity_of_cargo AS "QUANTITY OF CARGO",
                carrier_order.vessel_of_readiness_tendered_and_accepted AS "VESSEL OF READINESS TENDERED AND ACCEPTED"
            FROM
                carrier_order
            JOIN cargo_order ON cargo_order.order_id = carrier_order.or_id
            JOIN carrier ON carrier.cr_id = carrier_order.cr_id
            JOIN cargo ON cargo.cargo_id = cargo_order.cargo_id
            LEFT JOIN bulks ON bulks.cargo_orderOrder_id = cargo_order.order_id
            LEFT JOIN(
                SELECT
                    cargo_orderOrder_id,
                    COUNT(*) AS totalCount
                FROM
                    bulks
                GROUP BY
                    cargo_orderOrder_id
            ) AS orderCount
            ON
                orderCount.cargo_orderOrder_id = bulks.cargo_orderOrder_id
            WHERE
                carrier_order.group = ${id}
            GROUP BY
                carrier.carrier_name,
                cargo.cargo_name,
                carrier_order.category,
                carrier_order.arrival_time,
                carrier_order.deadline_time,
                carrier_order.latitude,
                carrier_order.longitude,
                carrier_order.maxFTS,
                cargo_order.load,
                cargo_order.bulk,
                carrier_order.penalty_rate,
                carrier_order.reward_rate,
                carrier_order.group,
                bulks.load_bulk,
                bulks.cargo_orderOrder_id,
                orderCount.totalCount;
      `;

        const formattedResult = result.map((row) => {
            const {
                load_bulk,
                cargo_orderOrder_id,
                totalCount,
                ...remainingProperties
            } = row;

            const totalBulks = Array.from(
                { length: Number(totalCount) },
                (_, index) => ({
                    [`bulk${index + 1}`]: load_bulk,
                })
            );

            const bulksObject = totalBulks.reduce(
                (acc, bulk) => ({ ...acc, ...bulk }),
                {}
            )
            // return {

            //     ...remainingProperties,
            //     ...bulksObject,
            // };
            return {
                "order_id": remainingProperties.order_id,
                "carrier_name": remainingProperties.carrier_name,
                "cargo_name": remainingProperties.cargo_name,
                "category": remainingProperties.category,
                "arrival_time": remainingProperties.arrival_time,
                "deadline_time": remainingProperties.deadline_time,
                "latitude": remainingProperties.latitude,
                "longitude": remainingProperties.longitude,
                "maxFTS": remainingProperties.maxFTS,
                "load": remainingProperties.load,
                "bulk": remainingProperties.bulk,
                "penalty_rate": remainingProperties.penalty_rate,
                "reward_rate": remainingProperties.reward_rate,
                // ...bulksObject,
                "NAME OF VESSEL": remainingProperties["NAME OF VESSEL"],
                "NAME OF MASTER": remainingProperties["NAME OF MASTER"],
                "NAME OF OWNER": remainingProperties["NAME OF OWNER"],
                "NAME OF AGENT": remainingProperties["NAME OF AGENT"],
                "NAME OF SHIPPER": remainingProperties["NAME OF SHIPPER"],
                "NAME OF CONSIGNEE": remainingProperties["NAME OF CONSIGNEE"],
                "NAME OF SURVEYOTS": remainingProperties["NAME OF SURVEYOTS"],
                "NAME OF STEVEDORE": remainingProperties["NAME OF STEVEDORE"],
                "PORT OF LOADING CARGO": remainingProperties["PORT OF LOADING CARGO"],
                "PORT OF DISCHARGING CARGO": remainingProperties["PORT OF DISCHARGING CARGO"],
                "DESCRIPTION OF CARGO": remainingProperties["DESCRIPTION OF CARGO"],
                "QUANTITY OF CARGO": remainingProperties["QUANTITY OF CARGO"],
                "VESSEL OF READINESS TENDERED AND ACCEPTED": remainingProperties["VESSEL OF READINESS TENDERED AND ACCEPTED"],
                bulk1: bulksObject.bulk1,
                bulk2: bulksObject.bulk2,
                bulk3: bulksObject.bulk3,
                bulk4: bulksObject.bulk4,
                bulk5: bulksObject.bulk5,
                bulk6: bulksObject.bulk6,
                bulk7: bulksObject.bulk7,
                bulk8: bulksObject.bulk8,
                bulk9: bulksObject.bulk9,
                bulk10: bulksObject.bulk10
            };
        });
        myCache.set('export-order', formattedResult, 600)

        return res.json(formattedResult);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred" });
    }
}

export const importCSVOrders = async (req: Request, res: Response) => {
    try {
        const group = req.body.group
        // ตรวจสอบว่ามีไฟล์ถูกอัปโหลดหรือไม่
        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }

        const buffer = req.file.buffer;
        const data = buffer.toString("utf-8");
        const dataWithoutBOM = data.replace(/^\uFEFF/, "");

        // แปลง CSV เป็น JSON
        const jsonData: any[] = await new Promise((resolve, reject) => {
            parse(dataWithoutBOM, { columns: true }, (err, records) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(records);
                }
            });
        });

        // console.log(jsonData)
        // res.json(jsonData)
        const carriersInDB = await prisma.carrier.findMany();
        // ตรวจสอบว่าเรือใน JSON มีในฐานข้อมูลหรือไม่
        const createCarriers = [];

        const jsonDataWithCRIDPromises = jsonData.map(async (record) => {
            const carrierName = record.carrier_name
            const maxFts = record.maxFTS
            const carrier = carriersInDB.find(
                (dbCarrier) => dbCarrier.carrier_name === carrierName
            )
            if (!carrier) {
                const createdCarrier = await prisma.carrier.create({
                    data: {
                        carrier_name: carrierName,
                        carrier_max_FTS: +maxFts,
                    },
                })

                createCarriers.push(createdCarrier);
                return { ...record, cr_id: createdCarrier.cr_id }
            } else {
                return { ...record, cr_id: carrier.cr_id }
            }
        })

        // รอให้ทุก Promise ถูก resolve
        const jsonDataWithCRID = await Promise.all(jsonDataWithCRIDPromises);

        const cargosInDB = await prisma.cargo.findMany();

        // ตรวจสอบว่า cargo ใน JSON มีในฐานข้อมูลหรือไม่
        const createCargos = [];

        const jsonDataWithCargoIdPromises = jsonDataWithCRID.map(async (record) => {
            const cargoName = record.cargo_name;

            const cargoInDB = cargosInDB.find(
                (dbCargo) => dbCargo.cargo_name === cargoName
            );
            if (!cargoInDB) {
                const createdCargo = await prisma.cargo.create({
                    data: {
                        cargo_name: cargoName,
                    },
                })

                createCargos.push(createdCargo);
                return { ...record, cargo_id: createdCargo.cargo_id };
            } else {
                return { ...record, cargo_id: cargoInDB.cargo_id };
            }
        });

        // // รอให้ทุก Promise ถูก resolve
        const jsonDataWithCargoId = await Promise.all(jsonDataWithCargoIdPromises);

        // const jsonDataWithSumBulk = jsonDataWithCargoId.map((record) => {
        //     const load = Array.from(
        //         { length: 100 },
        //         (_, index) => record[`bulk${index + 1}`] || 0
        //     )
        //         .map(Number)
        //         .reduce((acc, val) => acc + val, 0);

        //     return { ...record, load };
        // });
        const jsonDataWithSumBulk = jsonDataWithCargoId
            .filter(record => !Object.values(record).every(value => value === '' || value === null))
            .map((record) => {
                const load = Array.from(
                    { length: 100 },
                    (_, index) => record[`bulk${index + 1}`] || 0
                )
                    .map(Number)
                    .reduce((acc, val) => acc + val, 0);

                return { ...record, load };
            })

        console.table(jsonDataWithSumBulk)
        jsonDataWithSumBulk.forEach(async (record) => {
            const {
                cr_id,
                category,
                arrival_time,
                deadline_time,
                latitude,
                longitude,
                maxFTS,
                penalty_rate,
                reward_rate,
                cargo_id,
                load,
                bulk,
                "w": w,
                "NAME OF VESSEL": name_of_vessel,
                "NAME OF MASTER": name_of_master,
                "NAME OF OWNER": name_of_owner,
                "NAME OF AGENT": name_of_agent,
                "NAME OF SHIPPER": name_of_shipper,
                "NAME OF CONSIGNEE": name_of_consignee,
                "NAME OF SURVEYOTS": name_of_surveyots,
                "NAME OF STEVEDORE": name_of_stevedore,
                "PORT OF LOADING CARGO": port_of_loading_cargo,
                "PORT OF DISCHARGING CARGO": port_of_discharging_cargo,
                "DESCRIPTION OF CARGO": description_of_cargo,
                "VESSEL OF READINESS TENDERED AND ACCEPTED": vessel_of_readiness_tendered_and_accepted,
                "QUANTITY OF CARGO": quantity_of_cargo
            } = record;

            let allFormatsV2 = [
                "DD/MM/YYYY HH:mm",
                "D/M/YYYY HH:mm",
                "YYYY/MM/DD HH:mm",
                "YYYY-MM-DD HH:mm",
                "YYYY/MM/DD",
                "YYYY-MM-DD",
                "DD/MM/YYYY",
                "D/M/YYYY",
                "HH:mm:ss",
                "HH:mm",
            ];

            let arrival_timeV2 = moment(arrival_time, allFormatsV2).format(
                "YYYY-MM-DD HH:mm:ss"
            );

            // Check if arrival_timeV2 is "Invalid date"
            if (moment(arrival_timeV2).isValid()) {
                let deadline_timeV2 = moment(deadline_time, allFormatsV2).format(
                    "YYYY-MM-DD HH:mm:ss"
                );

                const createOrderCarrier = await prisma.carrier_order.create({
                    data: {
                        cr_id,
                        category,
                        arrival_time: arrival_timeV2,
                        deadline_time: deadline_timeV2,
                        latitude: +latitude,
                        longitude: +longitude,
                        maxFTS: +maxFTS,
                        penalty_rate: +penalty_rate,
                        reward_rate: +reward_rate,
                        group: +group,
                        w,
                        name_of_vessel,
                        name_of_master,
                        name_of_owner,
                        name_of_agent,
                        name_of_shipper,
                        name_of_consignee,
                        name_of_surveyots,
                        name_of_stevedore,
                        port_of_loading_cargo,
                        port_of_discharging_cargo,
                        description_of_cargo,
                        vessel_of_readiness_tendered_and_accepted,
                        quantity_of_cargo,

                    },
                });
                await Promise.all([

                ])
                await prisma.cargo_order.create({
                    data: {
                        order_id: createOrderCarrier.or_id,
                        cargo_id,
                        bulk: +bulk,
                        load,
                        group: +group
                    },
                });

                for (let i = 1; i <= bulk; i++) {
                    const bulkKey = `bulk${i}`;
                    const bulkValue = record[bulkKey];
                    if (bulkValue) {
                        await prisma.bulks.create({
                            data: {
                                cargo_orderOrder_id: createOrderCarrier.or_id,
                                load_bulk: +bulkValue,
                            },
                        });
                    }
                }

                await prisma.bulks.updateMany({
                    where: { cargo_orderOrder_id: createOrderCarrier.or_id },
                    data: {
                        group: +group
                    }
                });
            } else {
                console.log(`Skipping record with invalid arrival_time: ${arrival_time}`);
            }
        });


        await Promise.all([
            prisma.cargo.deleteMany({
                where: { cargo_name: null }
            }),
            prisma.carrier.deleteMany({
                where: { carrier_name: null }
            })

        ])
        res.json({ message: "OK" });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

export const deleteManyOrder = async (req: Request, res: Response) => {
    try {
        const id = +req.params.group
        await prisma.$transaction([
            prisma.solution_carrier_order.deleteMany({
                where: { s_id: id }
            }),
            prisma.solution_crane_schedule.deleteMany({
                where: { solution_id: id }
            }),
            prisma.solution_schedule.deleteMany({
                where: { solution_id: id }
            }),
            prisma.bulks.deleteMany({
                where: { group: id }
            }),
            prisma.cargo_order.deleteMany({
                where: { group: id }
            }),
            prisma.carrier_order.deleteMany({
                where: { group: id }
            }),
        ]);

        res.json({ message: "OK" });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

export const deleteManyOrdersChackbox = async (req: Request, res: Response) => {
    try {
        const ids = req.body
        console.log(ids)
        await prisma.$transaction([
            ...ids.map((id: number) => prisma.solution_carrier_order.deleteMany({ where: { order_id: +id } })),
            ...ids.map((id: number) => prisma.bulks.deleteMany({ where: { cargo_orderOrder_id: +id } })),
            ...ids.map((id: number) => prisma.cargo_order.deleteMany({ where: { order_id: +id } })),
            ...ids.map((id: number) => prisma.carrier_order.deleteMany({ where: { or_id: +id } }))
        ]);
        res.json({ message: "OK" });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

export const exportOrder = async (req: Request, res: Response) => {
    try {
        const { start_date, end_date, page, rows } = req.body
        // const pages = (page - 1) * rows ? page : 0
        let pages = 0
        if (page !== 0) {
            pages = (page - 1) * rows
        }

        // console.log(pages)

        let allFormatsV2 = [
            "DD/MM/YYYY HH:mm",
            "D/M/YYYY HH:mm",
            "YYYY/MM/DD HH:mm",
            "YYYY-MM-DD HH:mm",
            "YYYY/MM/DD",
            "YYYY-MM-DD",
            "DD/MM/YYYY",
            "D/M/YYYY",
            "HH:mm:ss",
            "HH:mm",
        ];

        let start = moment(start_date, allFormatsV2).format(
            "YYYY-MM-DD HH:mm:ss"
        )
        let end = moment(end_date, allFormatsV2).format(
            "YYYY-MM-DD HH:mm:ss"
        )
        const result: any = rows ? await prisma.$queryRaw`
        SELECT
             carrier_order.or_id AS "order_id",
             carrier.carrier_name,
             cargo.cargo_name,
             carrier_order.category,
             carrier_order.arrival_time,
             carrier_order.deadline_time,
             carrier_order.latitude,
             carrier_order.longitude,
             carrier_order.maxFTS,
             cargo_order.load,
             cargo_order.bulk,
             carrier_order.penalty_rate,
             carrier_order.reward_rate,
             carrier_order.group,
             bulks.load_bulk,
             bulks.cargo_orderOrder_id,
             orderCount.totalCount,
             carrier_order.w AS "W",
             carrier_order.name_of_vessel AS "NAME OF VESSEL",
             carrier_order.name_of_master AS "NAME OF MASTER",
             carrier_order.name_of_owner AS "NAME OF OWNER",
             carrier_order.name_of_agent AS "NAME OF AGENT",
             carrier_order.name_of_shipper AS "NAME OF SHIPPER",
             carrier_order.name_of_consignee AS "NAME OF CONSIGNEE",
             carrier_order.name_of_surveyots AS "NAME OF SURVEYOTS",
             carrier_order.name_of_stevedore AS "NAME OF STEVEDORE",
             carrier_order.port_of_loading_cargo AS "PORT OF LOADING CARGO",
             carrier_order.port_of_discharging_cargo AS "PORT OF DISCHARGING CARGO",
             carrier_order.description_of_cargo AS "DESCRIPTION OF CARGO",
             carrier_order.quantity_of_cargo AS "QUANTITY OF CARGO",
             carrier_order.vessel_of_readiness_tendered_and_accepted AS "VESSEL OF READINESS TENDERED AND ACCEPTED"
         FROM
             carrier_order
         JOIN cargo_order ON cargo_order.order_id = carrier_order.or_id
         JOIN carrier ON carrier.cr_id = carrier_order.cr_id
         JOIN cargo ON cargo.cargo_id = cargo_order.cargo_id
         LEFT JOIN bulks ON bulks.cargo_orderOrder_id = cargo_order.order_id
         LEFT JOIN(
             SELECT
                 cargo_orderOrder_id,
                 COUNT(*) AS totalCount
             FROM
                 bulks
             GROUP BY
                 cargo_orderOrder_id
         ) AS orderCount
         ON
             orderCount.cargo_orderOrder_id = bulks.cargo_orderOrder_id
         WHERE
             DATE(carrier_order.arrival_time) >= ${start} AND DATE(carrier_order.deadline_time) <= ${end}
         GROUP BY
             carrier_order.or_id
         ORDER BY
             carrier_order.arrival_time ASC
         LIMIT ${rows} OFFSET ${pages};
     ` : await prisma.$queryRaw`
        SELECT
             carrier_order.or_id AS "order_id",
             carrier.carrier_name,
             cargo.cargo_name,
             carrier_order.category,
             carrier_order.arrival_time,
             carrier_order.deadline_time,
             carrier_order.latitude,
             carrier_order.longitude,
             carrier_order.maxFTS,
             cargo_order.load,
             cargo_order.bulk,
             carrier_order.penalty_rate,
             carrier_order.reward_rate,
             carrier_order.group,
             bulks.load_bulk,
             bulks.cargo_orderOrder_id,
             orderCount.totalCount,
             carrier_order.w AS "W",
             carrier_order.name_of_vessel AS "NAME OF VESSEL",
             carrier_order.name_of_master AS "NAME OF MASTER",
             carrier_order.name_of_owner AS "NAME OF OWNER",
             carrier_order.name_of_agent AS "NAME OF AGENT",
             carrier_order.name_of_shipper AS "NAME OF SHIPPER",
             carrier_order.name_of_consignee AS "NAME OF CONSIGNEE",
             carrier_order.name_of_surveyots AS "NAME OF SURVEYOTS",
             carrier_order.name_of_stevedore AS "NAME OF STEVEDORE",
             carrier_order.port_of_loading_cargo AS "PORT OF LOADING CARGO",
             carrier_order.port_of_discharging_cargo AS "PORT OF DISCHARGING CARGO",
             carrier_order.description_of_cargo AS "DESCRIPTION OF CARGO",
             carrier_order.quantity_of_cargo AS "QUANTITY OF CARGO",
             carrier_order.vessel_of_readiness_tendered_and_accepted AS "VESSEL OF READINESS TENDERED AND ACCEPTED"
         FROM
             carrier_order
         JOIN cargo_order ON cargo_order.order_id = carrier_order.or_id
         JOIN carrier ON carrier.cr_id = carrier_order.cr_id
         JOIN cargo ON cargo.cargo_id = cargo_order.cargo_id
         LEFT JOIN bulks ON bulks.cargo_orderOrder_id = cargo_order.order_id
         LEFT JOIN(
             SELECT
                 cargo_orderOrder_id,
                 COUNT(*) AS totalCount
             FROM
                 bulks
             GROUP BY
                 cargo_orderOrder_id
         ) AS orderCount
         ON
             orderCount.cargo_orderOrder_id = bulks.cargo_orderOrder_id
         WHERE
             DATE(carrier_order.arrival_time) >= ${start} AND DATE(carrier_order.deadline_time) <= ${end}
         GROUP BY
             carrier_order.or_id
         ORDER BY
             carrier_order.arrival_time ASC; 
        `;

        const formattedResult = result.map(row => {
            const {
                load_bulk,
                cargo_orderOrder_id,
                totalCount,
                ...remainingProperties
            } = row;

            const totalBulks = Array.from({ length: Number(totalCount) }, (_, index) => ({
                [`bulk${index + 1}`]: load_bulk,
            }));

            const bulksObject = totalBulks.reduce((acc, bulk) => ({ ...acc, ...bulk }), {});

            return {
                ...remainingProperties,
                ...bulksObject,
            };
        });

        return res.json(formattedResult);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}