"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routers_1 = __importDefault(require("./route/routers"));
const MiddlewareSetup_1 = __importDefault(require("./middleware/MiddlewareSetup"));
const app = (0, express_1.default)();
app.use(MiddlewareSetup_1.default);
app.use("/api", routers_1.default);
// const connection = mysql.createConnection({ host: "127.0.0.1", user: "sugarotpzlab_crane", password: "P@ssw0rd;Crane", port: 3306, database: "sugarotpzlab_crane" });
// const connection = mysql.createConnection("mysql://root:PVWtLvJGNUBPlmj71R6bAao=@10.148.0.2/sugarotpzlab_crane");
// connection.connect((err) => {
//     if (err) {
//         console.error("Error connecting to MySQL:", err);
//         return;
//     }
//     console.log("Connected to MySQL");
// });
const port = 7070;
app.listen(port, () => {
    console.log(`Connected to the server on port ${port}`);
});
