//-----------------------------------------------------------------------------------------------arrays y variables
const cursosDisponibles = ["JavaScript Básico", "Desarrollo Web", "Python para Principiantes", "Diseño UX/UI"];
let cursoElegido = "";
let nombreUsuario = "";
let inscripcionConfirmada = false;

//-----------------------------------------------------------------------------------------------FUNCIONES 

//-------------------------------------------solicitar nombre
function solicitarNombre() {
nombreUsuario = prompt("¡Bienvenido al simulador de inscripción!\nPor favor, ingresá tu nombre:");
console.log("Nombre ingresado:", nombreUsuario);
}

//--------------------------------------------mostrar cursos
function mostrarYSeleccionarCurso() {
let mensaje = "Cursos disponibles:\n";

for (let i = 0; i < cursosDisponibles.length; i++) {
    mensaje += (i + 1) + ". " + cursosDisponibles[i] + "\n";
}

let seleccion = parseInt(prompt(`${mensaje}\nSeleccioná un curso (1 a ${cursosDisponibles.length}):`)) - 1;

if (seleccion >= 0 && seleccion < cursosDisponibles.length) {
    cursoElegido = cursosDisponibles[seleccion];
    console.log("Curso seleccionado:", cursoElegido);
} else {
    alert("Selección inválida. Por favor, recargá la página e intentá de nuevo.");
}
}

//------------------------------------------confirmar inscripción
function confirmarInscripcion() {
if (cursoElegido) {
    let confirmacion = confirm(
    `Hola ${nombreUsuario}, estás por inscribirte en el curso:\n"${cursoElegido}".\n\n¿Deseás confirmar la inscripción?`
    );

    if (confirmacion) {
    inscripcionConfirmada = true;
    alert("¡Inscripción confirmada!\nNos comunicaremos con vos a la brevedad.");
    console.log(`${nombreUsuario} se ha inscripto en: ${cursoElegido}`);
    } else {
    alert("Has cancelado la inscripción.");
    console.log(`${nombreUsuario} canceló la inscripción.`);
    }
}
}

//-------------------------------------------------------------------------------------------LLAMADAS A FUNCIONES
solicitarNombre();
mostrarYSeleccionarCurso();
confirmarInscripcion();