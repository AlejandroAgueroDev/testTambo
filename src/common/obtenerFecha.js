export function obtenerFechaActual(tipo) {
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, "0"); // Asegura 2 dígitos
    const mes = String(hoy.getMonth() + 1).padStart(2, "0"); // Mes empieza en 0
    const anio = hoy.getFullYear();
    const hora = String(hoy.getHours()).padStart(2, "0");
    const min = String(hoy.getMinutes()).padStart(2, "0");

    if (tipo === "fecha") {
        return `${dia}-${mes}-${anio}`;
    } else if (tipo === "hora") {
        return `${hora}:${min}`;
    } else if ("dato") {
        return hoy;
    } else {
        return `${dia}-${mes}-${anio}`;
    }
}
