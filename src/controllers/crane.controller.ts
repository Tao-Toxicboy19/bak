import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GetCrane = async (req: Request, res: Response) => {
    try {
        const resutlt = await prisma.crane.findMany()
        return res.json(resutlt)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error });
    }
}


export const createCrane = async (req: Request, res: Response) => {
    try {
        const { crane_name, FTS_id, setuptime_crane, wage_month_cost } = req.body
        const createCrane = await prisma.crane.create({
            data: {
                crane_name,
                FTS_id,
                setuptime_crane: +setuptime_crane,
                wage_month_cost: +wage_month_cost,
            }
        })
        return res.json(createCrane);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error });
    }
}

export const UpdateCrane = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);

        const { crane_name, FTS_id, setuptime_crane, wage_month_cost } = req.body
        const updateCrane = await prisma.crane.update({
            where: {
                id: id
            },
            data: {
                crane_name, FTS_id, setuptime_crane, wage_month_cost
            }
        })

        return res.json(updateCrane);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error });
    }
}

export const GetByIdCrane = async (req: any, res: any) => {
    const craneId = req.params.id;
    const result = await prisma.crane.findUnique({
        where: {
            id: +craneId
        }
    })

    return res.json(result)
}

export const CraneDelete = async (req: any, res: any) => {
    const id = req.params.id;
    const result = await prisma.crane.delete({
        where: { id }
    })
    return res.json({ message: 'ลบรถเครนเรียบร้อยแล้ว' })
}