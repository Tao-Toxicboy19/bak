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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrantPermissions = exports.findAllUser = exports.roles = exports.Login = exports.Register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const Register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!(username && password))
            return res.status(400).send("All input is required");
        const oldUser = yield prisma.users.findUnique({
            where: { username: username },
        });
        if (oldUser)
            return res.status(409).send("User already exists. Please login");
        const encryptedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = yield prisma.users.create({
            data: {
                username: username,
                password: encryptedPassword,
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
exports.Register = Register;
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!(username && password))
            return res.status(400).send("Username and password are required");
        const user = yield prisma.users.findUnique({
            where: { username: username },
        });
        if (!user)
            return res.status(401).send("Invalid credentials");
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid)
            return res.status(401).send("Invalid credentials");
        const payload = {
            user: {
                userId: user.id,
                name: user.username,
                role: user.roles,
                group: user.group
            },
        };
        const token = jsonwebtoken_1.default.sign(payload, "Toxicboy", {
            expiresIn: "9999999999999999999999999999h",
        });
        return res.status(200).json({ message: "OK", token });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});
exports.Login = Login;
const roles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, name, role, group } = req.user;
        return res.status(200).json({ message: "OK", userId, name, role, group });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});
exports.roles = roles;
const findAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, roles } = req.query;
        const users = yield prisma.users.findMany({
            where: {
                username: { contains: username },
                roles: { contains: roles },
            },
        });
        const usersWithoutPassword = users.map((_a) => {
            var { password } = _a, rest = __rest(_a, ["password"]);
            return rest;
        });
        return res.json(usersWithoutPassword);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});
exports.findAllUser = findAllUser;
const GrantPermissions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        const { roles } = req.body;
        const updatedUser = yield prisma.users.update({
            where: { id: id },
            data: { roles: roles },
        });
        return res.status(200).json(updatedUser);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});
exports.GrantPermissions = GrantPermissions;
