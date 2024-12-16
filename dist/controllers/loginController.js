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
exports.signup = exports.signin = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uname, pass } = req.body;
        if (!(uname && pass))
            return res.status(400).send("Username and password are required");
        const user = yield prisma.users.findUnique({
            where: { username: uname },
        });
        if (!user)
            return res.status(401).send("Invalid credentials");
        if (pass !== user.password)
            return res.status(401).send("Invalid credentials");
        const payload = {
            user: {
                userId: user.id,
                name: user.username,
                role: user.roles,
                group: user.group
            },
        };
        const token = jsonwebtoken_1.default.sign(payload, "Toxicboy", { expiresIn: "9999999999999999999999999999h", });
        return res.status(200).json({ message: token });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});
exports.signin = signin;
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uname, pass } = req.body;
        if (!(uname && pass))
            return res.status(400).send("All input is required");
        const oldUser = yield prisma.users.findUnique({
            where: { username: uname },
        });
        if (oldUser)
            return res.status(409).send("User already exists. Please login");
        const newUser = yield prisma.users.create({
            data: {
                username: uname,
                password: pass,
            },
        });
        const token = jsonwebtoken_1.default.sign({ userId: newUser.id }, "Toxicboy", {
            expiresIn: "24h",
        });
        return res.status(201).json({ access_token: token });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});
exports.signup = signup;
