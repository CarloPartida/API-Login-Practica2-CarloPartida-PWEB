const formLogin = document.getElementById('formLogin');
const mensaje = document.getElementById('mensaje');
const btnPerfil = document.getElementById('btnPerfil');
const btnLogout = document.getElementById('btnLogout');

// Iniciar sesion - POST
formLogin.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que el navegador recargue la pagina al enviar el form

    //Declaramos los datos a ingresar del form
    const correo = document.getElementById('correo').value;
    const password = document.getElementById('password').value;

    const url = formLogin.getAttribute('action');
    const metodo = formLogin.getAttribute('method');

    //Hacemos la peticion y enviamos los datos al servidor en JSON
    const res = await fetch(url, 
    {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password })
    });

    //Leemos las respuestas del servidor y mostramos los mensajes
    const data = await res.json();
    mensaje.textContent = data.mensaje;
    mensaje.style.color = res.ok ? 'green' : 'red';
});

// Consultar perfil - GET
btnPerfil.addEventListener('click', async () => {
    const res = await fetch('/perfil'); //Hacemos peticion y esperamos la funcion del controller
    const data = await res.json();

    //Si esta iniciada mostramos el mensaje con los siguientes datos con color azul
    if (res.ok) 
    {
        mensaje.textContent = `${data.mensaje}: ${data.usuario.correo} (ID: ${data.usuario.id})`;
        mensaje.style.color = 'blue';
    } 
    else     
    {
        //Si no, mostramos un mensaje de error en color rojo
        mensaje.textContent = data.mensaje;
        mensaje.style.color = 'red';
    }
});

// Cerrar sesion - POST
btnLogout.addEventListener('click', async () => {
    const res = await fetch('/logout', { method: 'POST' }); //Hacemos peticion y esperamos la funcion Logout
    const data = await res.json();

    mensaje.textContent = data.mensaje; //Mandamos el mensaje de que cerramos sesion
    mensaje.style.color = res.ok ? 'green' : 'red'; 
    if (res.ok) formLogin.reset(); //Y limpiamos los campos del form
});