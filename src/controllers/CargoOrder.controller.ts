import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const postCargoOrderController = async (req: Request, res: Response) => {
    try {
        const { order_id, cargo } = req.body;

        const cargoOrders = await prisma.cargo_order.createMany({
            data: cargo.map((cargoItem) => ({
                order_id,
                cargo_id: cargoItem.cargo_id,
                load: cargoItem.load,
                bulk: cargoItem.bulk,
            })),
        });

        return res.json({ message: "ok", result: cargoOrders });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred" });
    }
};


export const getLastCargoOrderIdController = async (_req: Request, res: Response) => {
    try {
        const lastCargoOrder = await prisma.carrier_order.findFirst({
            orderBy: { or_id: 'desc' },
        });

        if (!lastCargoOrder) {
            return res.status(404).json({ error: "No cargo orders found" });
        }

        return res.json({ lastCargoOrderId: lastCargoOrder.or_id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred" });
    }
};

export const putCargoOrderController = async (req: Request, res: Response) => {
    try {
        const { order_id, cargo, bulk_values } = req.body;
        
        await prisma.cargo_order.deleteMany({
            where: {
                order_id: order_id,
            },
        });

        const cargoOrders = await prisma.cargo_order.createMany({
            data: cargo.map((cargoItem, index) => ({
                order_id,
                cargo_id: cargoItem.cargo_id,
                load: cargoItem.load,
                bulk: cargoItem.bulk,
                ...bulk_values[index],
            })),
        });

        return res.json({ message: "ok" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred" });
    }
};





