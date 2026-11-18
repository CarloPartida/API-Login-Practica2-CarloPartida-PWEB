const logModel = require('../models/logModel');

// Función para Iniciar Sesión
async function login(req, res)
{
    try
    {
        const correo = req.body.correo;
        const password = req.body.password;

        if
        (   //Validaciones de tipo string y que no esté en blanco
            typeof correo !== 'string' || !correo.trim() ||
            typeof password !== 'string' || !password.trim()
        )
        { //Si no cumplen, error:
            return res.status(400).json({ mensaje: 'Campo en blanco o datos invalidos' });
        }

        //Mandamos el correo al Model para buscar el registro en la BD
        const usuario = await logModel.buscarUsuario
        (
            correo.trim()
        );

        // Validamos que exista el registro y coincida la contraseña
        if 
        (
            !usuario || 
            password !== usuario.password
        ) 
        { //Si no, respondemos con error
            return res.status(401).json
            ({
                mensaje: "Credenciales Incorrectas"
            });
        }

        // Guardamos en la sesion los datos obtenidos de la BD
        req.session.usuario = 
        {
            id: usuario.id_login,
            correo: usuario.correo
        };

        //Al ser correcto respondemos con un mensaje de exito
        return res.status(200).json
        ({ 
            mensaje: 'Login exitoso', 
            usuario: req.session.usuario 
        });
    }
    catch(error)
    {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
}

// Funcion para consultar el perfil
async function perfil(req, res)
{
    try
    {
        if (!req.session.usuario) //Si no existe una sesion activa (usuario no autenticado)
        {
            return res.status(401).json
            ({ //Mostrar:
                mensaje: "Debes iniciar sesion"
            });
        }

        return res.status(200).json //Si existe una sesion activa, mostramos los datos del usuario:
        ({
            mensaje: "Perfil del usuario",
            usuario: req.session.usuario
        });
    }
    catch (error)
    {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
}

// Funcion para cerrar sesion
async function logout(req, res)
{
    try
    {
        req.session.destroy((error) => //Destruimos la sesion
        {
            if (error)
            {
                return res.status(500).json
                ({
                    mensaje: "No se pudo cerrar sesion"
                });
            }

            res.clearCookie("sesion.sid", //Limpiamos la cookie
            {
                path: "/",
                sameSite: "lax",
                secure: false
            });

            return res.status(200).json
            ({
                mensaje: "Sesion cerrada exitosamente"
            });
        });
    }
    catch (error)
    {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
}

module.exports = 
{
    login,
    perfil,
    logout
};