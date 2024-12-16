import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
import morgan from "morgan";

const app = express();

app.use(cors({
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'))
app.use(session({
    secret: "escret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}));

export default app