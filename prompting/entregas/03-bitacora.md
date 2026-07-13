# 📓 Bitácora de Prompts — Ejercicio N° ___

> Copiá este archivo por cada ejercicio que entregues. Nombralo, por ejemplo, `entregas/01-bitacora.md`.
> Esta bitácora **es parte de la nota**. Un ejercicio sin bitácora no se corrige.

---

## Datos

- **Alumno/a:** Franco Urquizo y Facundo Angel
- **Ejercicio:** N° 2 — Extracción de código repetido a Helpers 
- **Fecha:** 13/07/26
- **Modelo de IA usado:** (ej: ChatGPT, Claude, Gemini, Copilot) opencoode / Gemini

---

## 1. 🎯 Qué me pidieron

Resumí en 2–3 líneas el objetivo del ejercicio con tus palabras (no copiado del enunciado).

Lo que me pidio es que use la AI para extraer la logica repetida a funciones reutilizables, que serian los helpers, para que se ataque la duplicacion dentro de una misma capa. 

## 2. 💬 Mis prompts (en orden)

Pegá **todos** los prompts que usaste, en orden, con la respuesta resumida y qué hiciste con ella. Agregá tantos como necesites.

### Prompt #1

**Lo que escribí:**
trabaja como un experto en programacion de node.js y Extrae la logica repetida a funciones reutilizables. Te paso contexto Ejercicio 03 — Extracción de código repetido a Helpers ⭐⭐
Foco: modularización, separación de responsabilidades Tiempo estimado: 1 clase ⬅️ Volver al README

🎯 Objetivo
Que uses la IA para extraer lógica repetida a funciones reutilizables (helpers). A diferencia del ejercicio 02 (que ataca la duplicación entre entidades), este ataca la duplicación dentro de una misma capa: el patrón que se repite endpoint por endpoint.

💡 Dato del proyecto: ya existe src/helpers/log-helper.js y dos repositorios que delegan el manejo del Pool a una clase DbPg (db-pg.js). O sea: la idea de "extraer a un helper" ya está plantada en el código. Tu trabajo es llevarla más lejos.

📋 El problema
Abrí alumnos-controller.js y mirá cuántas veces se repite esto:

try {
    const algo = await currentService.loQueSea();
    if (algo != null) {
        res.status(StatusCodes.OK).json(algo);
    } else {
        res.status(StatusCodes.NOT_FOUND).send(`No se encontro...`);
    }
} catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error: ${error.message}`);
}
Está en cada uno de los 5 endpoints, y otra vez en cursos-controller.js (y en materias-controller.js, si lo creaste en el ejercicio 01). Candidatos a helper:

Estos dos son los que tenés que hacer (cada uno ejercita un tipo distinto de extracción):

🎯 Helper de respuestas (responderOk, responderNotFound, responderError…) para unificar el formato de las respuestas HTTP que hoy está copiado en cada endpoint de los controllers.
🎯 Helper de fechas: sacar calcularEdad / agregarEdad, que hoy viven adentro de alumnos-service.js, a un helper reutilizable. Ese cálculo no es lógica de "alumnos": es una utilidad de fechas que mañana podrían usar otras entidades. Tu trabajo es darte cuenta de que no pertenece al service y mudarlo a src/helpers/.
🔧 La idea: extraer lo repetido a un método
Volvé a mirar el bloque de arriba. Fijate que pedazos como este aparecen igual en endpoint tras endpoint, en alumnos, en cursos, en materias:

res.status(StatusCodes.NOT_FOUND).send(`No se encontro...`);
Extraer a un helper es exactamente eso: agarrar ese pedacito que se repite y ponerlo en una función con nombre (algo del estilo responderNotFound(res, mensaje)) que viva en src/helpers/. Después, en cada endpoint, en vez de escribir el res.status(...).send(...) a mano, llamás a esa función.

Si lo hacés bien, deberías lograr que:

el endpoint quede más corto y más fácil de leer, y
el "qué status code corresponde a cada caso" quede en un solo lugar (el helper), no copiado por todos lados.
🧩 Cómo lo implementás exactamente —qué funciones creás, cómo se llaman, qué reciben y devuelven— lo resolvés vos con la IA. Esa es la parte del ejercicio. Acá solo te marcamos qué problema atacar, no cómo resolverlo.

📦 Qué tenés que lograr
Hacé los dos helpers marcados con 🎯:

respuestas-helper.js — extraé el res.status(...).send/json(...) repetido en los controllers a funciones con nombre (responderOk, responderNotFound, responderError…) en src/helpers/.
fechas-helper.js — sacá calcularEdad / agregarEdad de alumnos-service.js a src/helpers/ y dejá que el service los importe en vez de definirlos adentro.
Reemplazá las repeticiones por llamadas al helper (controllers y service).
Que los endpoints respondan exactamente igual que antes: mismos status code, mismo body, y la edad de cada alumno tiene que dar el mismo número.
🤖 Cómo encarar el prompting
Prompt de diagnóstico primero:

Pegale alumnos-controller.js y cursos-controller.js y pedile: "identificá qué lógica se repite y propondría extraer a un helper, sin escribir código todavía. Listame los candidatos ordenados por cuánto código ahorran."

Después, ejecución:

Pedí un helper a la vez. Restricción clave: "el helper tiene que ser una función pura / un módulo independiente, exportado con ES modules, y no debe cambiar la respuesta HTTP que ya devuelven los endpoints".

💡 Tip: pedile a la IA que te diga dónde poner el helper y cómo nombrarlo según la convención del proyecto (mirá cómo está hecho LogHelper: clase con métodos estáticos vs. funciones sueltas). Coherencia > "lo más moderno".

🔍 Verificación del resultado
 Los helpers están en src/helpers/ y son import-ables (ES modules, no require).
 Cada endpoint que usa el helper quedó más corto y se lee mejor.
 Los status codes no cambiaron: probá happy path y casos de error (404, 400) en Postman.
 calcularEdad / agregarEdad ya no están definidos dentro de alumnos-service.js: viven en src/helpers/fechas-helper.js y el service los importa. La edad de los alumnos sigue dando el mismo número.


**Por qué necesité este segundo prompt** (qué falló o faltó en el anterior):
Segundo Promt


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





*(Repetí la estructura para cada prompt. Si resolviste todo con un solo prompt gigante, ⚠️ eso es 🟡 según EFSI — explicá por qué.)*

Yo use dos promts porque primero le pedi que me haga el helper de pespuesta y luego use otro promt para seguir con fechas helper

## 3. 🔧 Qué hizo la IA y qué hice yo

Marcá esto **también en el código** con comentarios `// [IA]` y `// [YO]`. Acá resumilo:

| Archivo / función | Lo generó la IA | Lo modifiqué/escribí yo | Por qué |
Archivo	Cambio
respuestas-helper.js	+3 comentarios [YO] (prompt, decisión de funciones sueltas, parámetro opcional)
fechas-helper.js	+4 comentarios [YO] (prompt, decisión de exports, qué se exporta)
base-controller.js	+2 comentarios [YO] (prompt, decisión de mantener StatusCodes)
alumnos-controller.js	+2 comentarios [YO] (prompt, imports selectivos)
alumnos-service.js	+2 comentarios [YO] (prompt, verificación de uso)
03 - Extraccion a Helpers.md	+1 tabla completa "Qué hizo la IA y qué hice yo"





## 4. 🐛 Errores o cosas mal que detecté en la respuesta de la IA

> Si ponés "ninguno", probablemente no las viste. **Siempre** hay algo (un import de más, un estilo distinto, un caso borde olvidado, una mala práctica de seguridad).



## 5. ✅ Verificación

Pegá el checklist de verificación del ejercicio y marcá lo que comprobaste **vos** (con qué evidencia: captura de Postman, salida de `npm test`, número de ms, etc.).

- [si] Rol
- [si] Contexto (¿pegaste código del proyecto?, no le pase codigo porque uso un agente. le pase la consigna y se la explique bien)
- [si] Tarea
- [si] Restricciones
- [si] Iteración

## 6. ✍️ Reflexión (300–600 palabras)

Cubrí: qué proceso seguiste, qué decisiones tomaste y por qué, qué aprendiste, y —lo más importante— **qué corregiste de lo que te dio la IA**. Escribí con tus palabras; esto se contrasta con el oral.



## 7. 🔗 Adjuntos

- [ ] Link/PDF de la conversación completa con la IA
- [ ] Commit(s) en GitHub: https://github.com/FrancoUrquizo/arquitectura-sample-node-pg-IA-public.git
- [ ] Capturas / evidencias de verificación
