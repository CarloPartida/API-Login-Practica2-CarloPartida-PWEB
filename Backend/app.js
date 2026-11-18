const express = require("express");
const session = require("express-session");
const crypto = require("node:crypto");
const logRouter = require("./routes/logRouter");
const path = require("path");

const app = express();

app.use(express.json());

app.use(session({
    name: "sesion.sid",
    secret: process.env.SESSION_SECRET // Firma de la cookie de sesion para detectar alteraciones
    ||
    crypto.randomBytes(32).toString("hex"),

    resave: false, // Evita guardar sesiones sin modificaciones innecesariamente

    saveUninitialized: false, // Evita guardar sesiones nuevas sin datos

    cookie: {
        httpOnly: true, // Impide que JS del navegador lea la cookie
        secure: false, // En produccion debe ser true con HTTPS
        sameSite: "lax", // Ayuda a reducir determinados riesgos CSRF
        maxAge: 1000 * 60 * 30 // Establece la duracion de la cookie
    }
}));

app.use(express.static(path.join(__dirname, "../Frontend")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/indexs/Login.html"));
});

app.use("/", logRouter);

app.listen(3000, () => 
{
    console.log("Servidor en http://localhost:3000");
});