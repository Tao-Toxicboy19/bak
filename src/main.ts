import express from "express"
import router from "./route/routers"
import MiddlewareSetup from "./middleware/MiddlewareSetup"

const app = express()

app.use(MiddlewareSetup)
app.use("/api", router)


// const connection = mysql.createConnection({ host: "127.0.0.1", user: "sugarotpzlab_crane", password: "P@ssw0rd;Crane", port: 3306, database: "sugarotpzlab_crane" });

// const connection = mysql.createConnection("mysql://root:PVWtLvJGNUBPlmj71R6bAao=@10.148.0.2/sugarotpzlab_crane");

// connection.connect((err) => {
//     if (err) {
//         console.error("Error connecting to MySQL:", err);
//         return;
//     }
//     console.log("Connected to MySQL");
// });

const port = 7070
app.listen(port, () => {
    console.log(`Connected to the server on port ${port}`)
})
