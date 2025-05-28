
const usuarioDefault = {
    usuario: "juanp",
    password: "1234",
    nombre: "Juan Pérez",
    saldo: 15000,
    movimientos: [
        { tipo: "Depósito", monto: 15000, fecha: "2025-05-27" }
    ],
    cuentasDestino: [
        { alias: "maria.ahorro", nombre: "Maria López" },
        { alias: "carlos.sueldo", nombre: "Carlos Gómez" }
    ]
};

const loginContainer = document.getElementById("login-container");
const homeContainer = document.getElementById("home-container");
const accionesContainer = document.getElementById("acciones");

let usuarioActivo = null;


function guardarUsuarioEnStorage(usuarioObj) {
    localStorage.setItem("usuarioDatos", JSON.stringify(usuarioObj));
}


function obtenerUsuarioDeStorage() {
    const datos = localStorage.getItem("usuarioDatos");
    if (datos) {
        return JSON.parse(datos);
    } else {
        guardarUsuarioEnStorage(usuarioDefault);
        return usuarioDefault;
    }
}


usuarioActivo = obtenerUsuarioDeStorage();


function iniciarSesion() {
    document.getElementById("nombre-usuario").textContent = usuarioActivo.nombre;
    document.getElementById("saldo").textContent = usuarioActivo.saldo.toFixed(2);

    loginContainer.style.display = "none";
    homeContainer.style.display = "block";

    accionesContainer.innerHTML = "";
}

function cerrarSesion() {
    document.getElementById("usuario").value = "";
    document.getElementById("password").value = "";

    homeContainer.style.display = "none";
    loginContainer.style.display = "block";

    accionesContainer.innerHTML = "";

    Swal.fire({
        icon: "info",
        title: "Sesión cerrada",
        text: "Has salido correctamente.",
    });
}

function mostrarRegistro() {
    loginContainer.innerHTML = `
        <h2>Registro</h2>
        <form id="registro-form">
            <input type="text" id="reg-usuario" placeholder="Usuario" required />
            <input type="password" id="reg-password" placeholder="Contraseña" required />
            <input type="text" id="reg-nombre" placeholder="Nombre completo" required />
            <button type="submit">Registrarse</button>
        </form>
        <p>¿Ya tenés cuenta? <a href="#" id="mostrar-login">Iniciar sesión</a></p>
    `;

    const registroForm = document.getElementById("registro-form");
    registroForm.addEventListener("submit", function (e) {
        e.preventDefault();
        registrarUsuario();
    });

    document.getElementById("mostrar-login").addEventListener("click", function (e) {
        e.preventDefault();
        mostrarLogin();
    });
}

function mostrarLogin() {
    loginContainer.innerHTML = `
        <h2>Iniciar sesión</h2>
        <form id="login-form">
            <input type="text" id="usuario" placeholder="Usuario" required />
            <input type="password" id="password" placeholder="Contraseña" required />
            <button type="submit">Ingresar</button>
        </form>
        <p>¿No tenés cuenta? <a href="#" id="mostrar-registro">Registrate</a></p>
    `;

    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const usuarioInput = document.getElementById("usuario").value.trim();
        const passwordInput = document.getElementById("password").value.trim();

        if (usuarioInput === usuarioActivo.usuario && passwordInput === usuarioActivo.password) {
            iniciarSesion();
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Usuario o contraseña incorrectos",
            });
        }
    });

    document.getElementById("mostrar-registro").addEventListener("click", function (e) {
        e.preventDefault();
        mostrarRegistro();
    });
}


function registrarUsuario() {
    const usuario = document.getElementById("reg-usuario").value.trim();
    const password = document.getElementById("reg-password").value.trim();
    const nombre = document.getElementById("reg-nombre").value.trim();

    if (!usuario || !password || !nombre) {
        Swal.fire("Error", "Completá todos los campos", "error");
        return;
    }

    usuarioActivo = {
        usuario,
        password,
        nombre,
        saldo: 0,
        movimientos: [],
        cuentasDestino: usuarioDefault.cuentasDestino,
    };

    guardarUsuarioEnStorage(usuarioActivo);

    Swal.fire("Registro exitoso", "Ya podés iniciar sesión", "success");
    mostrarLogin();
}


function actualizarSaldoYMovimientos() {
    document.getElementById("saldo").textContent = usuarioActivo.saldo.toFixed(2);
}


function mostrarDeposito() {
    accionesContainer.innerHTML = `
        <h3>Depositar dinero</h3>
        <input type="number" id="monto-deposito" placeholder="Monto a depositar" />
        <button onclick="realizarDeposito()">Confirmar depósito</button>
    `;
}


function realizarDeposito() {
    const monto = parseFloat(document.getElementById("monto-deposito").value);

    if (isNaN(monto) || monto <= 0) {
        Swal.fire({
            icon: "warning",
            title: "Monto inválido",
            text: "Por favor ingresa un monto mayor a 0",
        });
        return;
    }

    usuarioActivo.saldo += monto;
    actualizarSaldoYMovimientos();

    const fecha = new Date().toISOString().split("T")[0];
    usuarioActivo.movimientos.push({
        tipo: "Depósito",
        monto,
        fecha,
    });

    guardarUsuarioEnStorage(usuarioActivo);

    Swal.fire({
        icon: "success",
        title: "¡Depósito exitoso!",
        text: `Se depositaron $${monto.toFixed(2)} ARS`,
    });

    accionesContainer.innerHTML = "";
}


function mostrarExtraccion() {
    accionesContainer.innerHTML = `
        <h3>Retirar dinero</h3>
        <input type="number" id="monto-extraccion" placeholder="Monto a retirar" />
        <button onclick="realizarExtraccion()">Confirmar retiro</button>
    `;
}


function realizarExtraccion() {
    const monto = parseFloat(document.getElementById("monto-extraccion").value);

    if (isNaN(monto) || monto <= 0) {
        Swal.fire({
            icon: "warning",
            title: "Monto inválido",
            text: "Ingresá un monto mayor a 0",
        });
        return;
    }

    if (monto > usuarioActivo.saldo) {
        Swal.fire({
            icon: "error",
            title: "Fondos insuficientes",
            text: "No tenés saldo suficiente para retirar ese monto",
        });
        return;
    }

    usuarioActivo.saldo -= monto;
    actualizarSaldoYMovimientos();

    const fecha = new Date().toISOString().split("T")[0];
    usuarioActivo.movimientos.push({
        tipo: "Extracción",
        monto,
        fecha,
    });

    guardarUsuarioEnStorage(usuarioActivo);

    Swal.fire({
        icon: "success",
        title: "Retiro exitoso",
        text: `Se retiraron $${monto.toFixed(2)} ARS`,
    });

    accionesContainer.innerHTML = "";
}


function mostrarHistorial() {
    if (usuarioActivo.movimientos.length === 0) {
        accionesContainer.innerHTML = "<p>No hay movimientos registrados.</p>";
        return;
    }

    let html = `
        <h3>Historial de movimientos</h3>
        <table border="1" style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th>Tipo</th>
                    <th>Monto</th>
                    <th>Fecha</th>
                </tr>
            </thead>
            <tbody>
    `;

    usuarioActivo.movimientos.forEach(mov => {
        html += `
            <tr>
                <td>${mov.tipo}</td>
                <td>$${mov.monto.toFixed(2)}</td>
                <td>${mov.fecha}</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    accionesContainer.innerHTML = html;
}

const cuentasDestinoFijas = [
    { alias: "maria.ahorro", nombre: "Maria López" },
    { alias: "carlos.sueldo", nombre: "Carlos Gómez" }
];


function mostrarTransferencia() {
    let options = cuentasDestinoFijas
    .map(cuenta => `<option value="${cuenta.alias}">${cuenta.nombre} (${cuenta.alias})</option>`)
    .join("");

    accionesContainer.innerHTML = `
    <h3>Transferir dinero</h3>
    <label for="alias-destino">Cuenta destino:</label>
    <select id="alias-destino">
        <option value="" disabled selected>Seleccione una cuenta</option>
        ${options}
    </select>
    <input type="number" id="monto-transferencia" placeholder="Monto a transferir" />
    <button onclick="realizarTransferencia()">Confirmar transferencia</button>
    `;
}


function realizarTransferencia() {
    const aliasDestino = document.getElementById("alias-destino").value;
    const monto = parseFloat(document.getElementById("monto-transferencia").value);

    if (!aliasDestino) {
    Swal.fire({
        icon: "warning",
        title: "Seleccione una cuenta destino",
        text: "Por favor elija una cuenta para transferir."
    });
    return;
    }

    if (isNaN(monto) || monto <= 0) {
    Swal.fire({
        icon: "warning",
        title: "Monto inválido",
        text: "Ingrese un monto mayor a 0."
    });
    return;
    }

    if (monto > usuarioActivo.saldo) {
    Swal.fire({
        icon: "error",
        title: "Fondos insuficientes",
        text: "No tiene saldo suficiente para realizar la transferencia."
    });
    return;
    }

    usuarioActivo.saldo -= monto;
    actualizarSaldoYMovimientos();

    const fecha = new Date().toISOString().split("T")[0];
    usuarioActivo.movimientos.push({
    tipo: `Transferencia a ${aliasDestino}`,
    monto: monto,
    fecha: fecha,
    });
    guardarUsuarioEnStorage(usuarioActivo);
    Swal.fire({
    icon: "success",
    title: "Transferencia realizada",
    text: `Se transfirieron $${monto.toFixed(2)} ARS a la cuenta ${aliasDestino}.`
    });

    accionesContainer.innerHTML = "";
}

window.addEventListener("DOMContentLoaded", () => {
    mostrarLogin();
});
