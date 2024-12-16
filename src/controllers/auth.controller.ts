import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface AuthRequest extends Request {
    user?: {
        userId: number;
        name: string;
        role: string;
        group: number;
    };
}

export const Register = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        if (!(username && password)) return res.status(400).send("All input is required");

        const oldUser = await prisma.users.findUnique({
            where: { username: username },
        });

        if (oldUser) return res.status(409).send("User already exists. Please login");

        const encryptedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.users.create({
            data: {
                username: username,
                password: encryptedPassword,
            },
        });

        const token = jwt.sign({ userId: newUser.id }, "Toxicboy", {
            expiresIn: "24h",
        });

        return res.status(201).json({ access_token: token });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
};



export const Login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        if (!(username && password)) return res.status(400).send("Username and password are required");

        const user = await prisma.users.findUnique({
            where: { username: username },
        });

        if (!user) return res.status(401).send("Invalid credentials");

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) return res.status(401).send("Invalid credentials");

        const payload = {
            user: {
                userId: user.id,
                name: user.username,
                role: user.roles,
                group: user.group
            },
        };
        const token = jwt.sign(payload, "Toxicboy", {
            expiresIn: "9999999999999999999999999999h",
        });

        return res.status(200).json({ message: "OK", token });

    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
}

export const roles = async (req: AuthRequest, res: Response) => {
    try {
        const { userId, name, role, group } = req.user;

        return res.status(200).json({ message: "OK", userId, name, role, group });

    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
}

export const findAllUser = async (req: AuthRequest, res: Response) => {
    try {
        const { username, roles } = req.query;

        const users = await prisma.users.findMany({
            where: {
                username: { contains: username as string },
                roles: { contains: roles as string },
            },
        });
        const usersWithoutPassword = users.map(({ password, ...rest }) => rest);
        return res.json(usersWithoutPassword);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
}

export const GrantPermissions = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { roles } = req.body;
        const updatedUser = await prisma.users.update({
            where: { id: id },
            data: { roles: roles },
        });
        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
}