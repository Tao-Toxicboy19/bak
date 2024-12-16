import { Request, Response } from "express"
import bcrypt from 'bcrypt'
import { PrismaClient } from "@prisma/client"
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export const signin = async (req: Request, res: Response) => {
    try {
        const { uname, pass } = req.body

        if (!(uname && pass)) return res.status(400).send("Username and password are required")

        const user = await prisma.users.findUnique({
            where: { username: uname },
        })

        if (!user) return res.status(401).send("Invalid credentials")

        if(pass !== user.password) return res.status(401).send("Invalid credentials")

        const payload = {
            user: {
                userId: user.id,
                name: user.username,
                role: user.roles,
                group: user.group
            },
        }
        const token = jwt.sign(payload, "Toxicboy", { expiresIn: "9999999999999999999999999999h", })

        return res.status(200).json({ message: token })

    } catch (error) {
        console.error(error)
        return res.status(500).send("Internal Server Error")
    }
}

export const signup = async (req: Request, res: Response) => {
    try {
        const { uname, pass } = req.body

        if (!(uname && pass)) return res.status(400).send("All input is required")

        const oldUser = await prisma.users.findUnique({
            where: { username: uname },
        })

        if (oldUser) return res.status(409).send("User already exists. Please login")

        const newUser = await prisma.users.create({
            data: {
                username: uname,
                password: pass,
            },
        })

        const token = jwt.sign({ userId: newUser.id }, "Toxicboy", {
            expiresIn: "24h",
        })

        return res.status(201).json({ access_token: token })
    } catch (error) {
        console.error(error)
        return res.status(500).send("Internal Server Error")
    }
}