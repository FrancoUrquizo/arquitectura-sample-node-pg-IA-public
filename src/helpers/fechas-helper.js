// [IA] Helper de fechas: utilidades reutilizables para cálculos con fechas.
// [IA] Extraído de alumnos-service.js para que cualquier entidad pueda usarlo.
// [YO] Prompt: "sacá calcularEdad y agregarEdad de alumnos-service a un helper reutilizable"
// [YO] Decisión: funciones sueltas exportadas como ES modules nombrados

// [IA] calcularEdad: calcula edad a partir de fecha de naciónacimiento
export function calcularEdad(fechaNacimiento) {
    if (!fechaNacimiento) return null;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mesDiff = hoy.getMonth() - nacimiento.getMonth();
    if (mesDiff < 0 || (mesDiff === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
}

// [IA] agregarEdad: agrega propiedad edad a un objeto alumno (spread + calcularEdad)
export function agregarEdad(alumno) {
    if (!alumno) return alumno;
    return { ...alumno, edad: calcularEdad(alumno.fecha_nacimiento) };
}
