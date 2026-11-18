const conexion = require('../database');

// Función para buscar un usuario por su correo
async function buscarUsuario(correo) 
{  
    const db = await conexion(); // Hacemos conexion a la BD
    const [obtenido] = await db.execute // Ejecuta la consulta
    (
        'SELECT * FROM login WHERE correo = ?', [correo] 
        //Se trabaja con el correo porque es el unico ID que conoce el usuario
    );

    await db.end(); // Finalizamos conexion a la BD

    return obtenido[0]; // Devolvemos el registro encontrado al controller en usuario
    //El 0 es para mandar un objeto en vez de arreglo
}

module.exports = 
{
    buscarUsuario
};