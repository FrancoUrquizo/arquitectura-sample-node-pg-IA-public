# Ejercicio 03 — Prompt para continuar: Helper de fechas

## Contexto: qué ya se hizo

Se completó la primera parte del Ejercicio 03: el **respuestas-helper.js**.

### Archivos ya creados/modificados
- `src/helpers/respuestas-helper.js` ✅ — Creado con 6 funciones: `responderOk`, `responderCreated`, `responderNotFound`, `responderBadRequest`, `responderInternalServerError`, `responderError`
- `src/controllers/base-controller.js` ✅ — Refactorizado para usar respuestas-helper
- `src/controllers/alumnos-controller.js` ✅ — Refactorizado para usar respuestas-helper

### Directorio `src/helpers/` actual
```
src/helpers/
  log-helper.js          (ya existía antes)
  respuestas-helper.js   (creado en esta sesión)
```

---

## Qué falta hacer

### 🎯 Helper de fechas: `src/helpers/fechas-helper.js`

Sacar `calcularEdad` y `agregarEdad` de `src/services/alumnos-service.js` (líneas 10-25) a un helper reutilizable en `src/helpers/fechas-helper.js`.

**Funciones a extraer (copiar tal cual):**

```js
// Estas líneas están en alumnos-service.js líneas 10-25:
function calcularEdad(fechaNacimiento) {
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

function agregarEdad(alumno) {
    if (!alumno) return alumno;
    return { ...alumno, edad: calcularEdad(alumno.fecha_nacimiento) };
}
```

### Pasos exactos

1. **Crear `src/helpers/fechas-helper.js`** con las dos funciones como exports nombrados (ES modules).
2. **Modificar `src/services/alumnos-service.js`** para:
   - Agregar: `import { calcularEdad, agregarEdad } from '../helpers/fechas-helper.js';`
   - Eliminar las definiciones de `calcularEdad` (líneas 10-20) y `agregarEdad` (líneas 22-25).
   - El resto del service NO cambia: sigue usando `agregarEdad(alumno)` igual que antes.

### Estado actual de `src/services/alumnos-service.js` (el que hay que modificar)

```js
// [AI] Cambio: ahora extiende BaseService. El repositorio se pasa al constructor de la clase madre.
// [AI] getAllAsync y getByIdAsync se sobrescriben con super para inyectar calcularEdad.
// [AI] createAsync y updateAsync ahora usan this.repository en vez de this.AlumnosRepository.
// [Student] La lógica de negocio: calcularEdad, agregarEdad y validarCursoExiste son tuyas, sin cambios.

import BaseService from './base-service.js';
import AlumnosRepository from '../repositories/alumnos-repository.js';
import CursosService from './cursos-service.js';

function calcularEdad(fechaNacimiento) {
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

function agregarEdad(alumno) {
    if (!alumno) return alumno;
    return { ...alumno, edad: calcularEdad(alumno.fecha_nacimiento) };
}

export default class AlumnosService extends BaseService {
    constructor() {
        super(new AlumnosRepository());
        this.CursosService = new CursosService();
    }

    async getAllAsync() {
        const returnArray = await super.getAllAsync();
        if (returnArray == null) return null;
        return returnArray.map(alumno => agregarEdad(alumno));
    }

    async getByIdAsync(id) {
        const returnEntity = await super.getByIdAsync(id);
        return agregarEdad(returnEntity);
    }

    async createAsync(entity) {
        await this.validarCursoExiste(entity.id_curso);
        return await super.createAsync(entity);
    }

    async updateAsync(entity) {
        if (entity.id_curso) {
            await this.validarCursoExiste(entity.id_curso);
        }
        return await super.updateAsync(entity);
    }

    validarCursoExiste = async (idCurso) => {
        if (!idCurso) return;
        const curso = await this.CursosService.getByIdAsync(idCurso);
        if (curso == null) {
            throw new Error(`El curso con id ${idCurso} no existe.`);
        }
    }
}
```

### Restricciones
- El helper debe ser un módulo ES modules (exports nombrados, no require).
- Las funciones se copian **tal cual** — la lógica interna no cambia.
- La edad de cada alumno tiene que dar el **mismo número** que antes.
- El helper no queda "atado" a alumnos: es reutilizable por cursos, materias, etc.
- Seguir la convención del proyecto: ver `log-helper.js` (clase) y `respuestas-helper.js` (funciones sueltas). Para fechas, funciones sueltas es lo correcto porque no necesitan estado.

### Verificación
- `node --check src/helpers/fechas-helper.js` (sin errores de sintaxis)
- `node --check src/services/alumnos-service.js` (sin errores de sintaxis)
- `node -e "import('./src/helpers/fechas-helper.js').then(m => console.log(Object.keys(m)))"` debe mostrar `['agregarEdad', 'calcularEdad']`

### Pregunta para el oral (ya planteada en el ejercicio original)
¿Un helper de respuestas debería conocer los status codes, o se los deberías pasar el controller? ¿Por qué? ¿Dónde "vive" la decisión de devolver 404?
- En nuestro helper, **el helper conoce los status codes**. La razón: el controller decide *qué caso es* (not found, error, ok) pero no debería saber *qué número HTTP le corresponde*. Esa decisión vive en el helper, que es el único lugar donde cambiaría si por ejemplo se estandarizan los codes de error.
