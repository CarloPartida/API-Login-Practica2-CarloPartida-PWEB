const express = require("express");
const router = express.Router();
const logController = require("../controllers/logController");

//Ruta para iniciar sesion
router.post("/login", logController.login);

//Ruta para consultar el perfil (sesion activa o no)
router.get("/perfil", logController.perfil);

//Ruta para cerrar sesion
router.post("/logout", logController.logout);

module.exports = router;