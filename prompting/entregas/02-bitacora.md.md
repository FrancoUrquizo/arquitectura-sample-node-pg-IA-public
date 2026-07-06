# 📓 Bitácora de Prompts — Ejercicio N° ___

> Copiá este archivo por cada ejercicio que entregues. Nombralo, por ejemplo, `entregas/01-bitacora.md`.
> Esta bitácora **es parte de la nota**. Un ejercicio sin bitácora no se corrige.

---

## Datos

- **Alumno/a:** Franco Urquizo y Facundo Angel
- **Ejercicio:** N° 2 — Refactorización del CRUD repetido
- **Fecha:** 06/07/26
- **Modelo de IA usado:** (ej: ChatGPT, Claude, Gemini, Copilot) opencoode / Gemini

---

## 1. 🎯 Qué me pidieron

Resumí en 2–3 líneas el objetivo del ejercicio con tus palabras (no copiado del enunciado).

Bueno en este ejrcicio el objetivo era fijarse que partes del codigo se encontraban "duplicadas" para que no se repita codigo, tenia que elegir distintas estrategias para abordar este problema y con la ia se decidio que la mejor manera era la herencia. Asi que le hice un buen promt con la consigna y ademas su contexto, su rol, su tarea y sus restricciones. 

## 2. 💬 Mis prompts (en orden)

Pegá **todos** los prompts que usaste, en orden, con la respuesta resumida y qué hiciste con ella. Agregá tantos como necesites.

### Prompt #1

**Lo que escribí:**
Trabaja como si fueras un desarrollardor backender profesioal especializado en NODE.js. Identifica la duplicacion y te voy a pasar un poco de contexto de el tp y de que hay que hacer en este ejercicio:📋 El problema
Mirá estos dos métodos de repositorios distintos:
// alumnos-repository.js
getAllAsync = async () => {
    console.log(`AlumnosRepository-new.getAllAsync()`);
    const sql = `SELECT * FROM alumnos`;
    return await this.db.queryAll(sql);
}
// cursos-repository.js  ← prácticamente lo mismo, cambia "alumnos" por "cursos"
getAllAsync = async () => {
    console.log(`CursosRepository.getAllAsync()`);
    const sql = `SELECT * FROM cursos`;
    return await this.db.queryAll(sql);
}
💡 Ojo: el try/catch y el manejo del Pool ya están extraídos en la clase DbPg (db-pg.js). Lo que sigue duplicado entre repositories es el armado del SQL y el nombre de la tabla/columnas. Esa es la duplicación que ataca este ejercicio.

Lo mismo pasa en los services (puro pass-through) y en los controllers (el patrón try/catch + status code se repite endpoint por endpoint, entidad por entidad).

📦 Qué tenés que lograr
Elegí una de estas estrategias (discutila con la IA, no la elijas a ciegas).

La idea de fondo de todas es la misma: el código común se escribe una sola vez, y cada entidad (alumnos, cursos, materias) solo aporta lo que tiene de distinto (su nombre de tabla y sus columnas). Cambian en cómo logran eso.

A) Repository base por herencia ("es un")
Una clase "madre" BaseRepository tiene los métodos comunes (los que solo dependen de la tabla y el id: getAllAsync, getByIdAsync, deleteByIdAsync). Cada repositorio hereda de ella y solo dice su tabla + sus métodos propios.

// La clase madre tiene lo común, parametrizado por el nombre de la tabla
class BaseRepository {
    constructor(tabla) {
        this.tabla = tabla;
        this.db = new Db();
    }
    getAllAsync = async () => await this.db.queryAll(`SELECT * FROM ${this.tabla}`);
    // ...getByIdAsync y deleteByIdAsync también viven acá
}

// CursosRepository "ES UN" BaseRepository de la tabla cursos:
class CursosRepository extends BaseRepository {
    constructor() { super('cursos'); }   // ← le pasa su tabla a la madre

    // Solo agrega lo específico (las columnas propias del INSERT/UPDATE):
    createAsync = async (entity) => { /* INSERT INTO cursos (nombre) ... */ }
}
Así CursosRepository ya tiene getAllAsync gratis, sin volver a escribirlo. Lo mismo AlumnosRepository extends BaseRepository, pasando 'alumnos'.

🔤 Palabra clave: extends / herencia. Pensalo como "es un": un curso-repository es un repository base, pero de la tabla cursos.

B) Repository por composición ("tiene un"), sin herencia
En vez de heredar, cada repositorio tiene adentro un objeto genérico que sabe hacer lo común, y al crearlo le pasa su nombre de tabla por parámetro. No hay clase madre/hija: hay un objeto que se parametriza y al que se le delega.

// Un repositorio genérico que sabe hacer lo común para CUALQUIER tabla
class GenericRepository {
    constructor(tabla) {
        this.tabla = tabla;
        this.db = new Db();
    }
    getAllAsync = async () => await this.db.queryAll(`SELECT * FROM ${this.tabla}`);
    // ...getByIdAsync y deleteByIdAsync también viven acá
}

// CursosRepository "TIENE UN" GenericRepository configurado con 'cursos':
class CursosRepository {
    constructor() {
        this.base = new GenericRepository('cursos');   // ← crea el objeto y le pasa la tabla
    }
    // Lo común se lo PIDE a su objeto interno (delega):
    getAllAsync = async () => await this.base.getAllAsync();

    // Y agrega lo suyo:
    createAsync = async (entity) => { /* INSERT INTO cursos (nombre) ... */ }
}
AlumnosRepository hace lo mismo: this.base = new GenericRepository('alumnos') y delega lo común.

🔤 Diferencia con A: en A heredás ("es un": un curso-repo es un repository base). En B tenés un objeto adentro y lo parametrizás ("tiene un": un curso-repo tiene un repository genérico configurado con 'cursos'). Las dos eliminan la duplicación. Para este proyecto, A suele ser la más corta; B evita la herencia a cambio de delegar cada método común.

C) La que te proponga la IA
Cualquier otra estrategia que te ofrezca la IA, siempre que la entiendas y la puedas justificar en el oral. Si no la podés explicar, no la elijas.

El resultado, elijas la que elijas: menos líneas duplicadas, mismo comportamiento, los endpoints siguen respondiendo igual.

🔐 Nota sobre seguridad (interpolar el nombre de tabla): si elegís la estrategia A, el método genérico va a hacer algo como SELECT * FROM ${this.tabla}. Eso es interpolar un string en el SQL — justo lo que el ejercicio 09 te dice que NO hagas. La diferencia clave: acá this.tabla es una constante que definís vos (el desarrollador), no un dato que manda el usuario. Interpolar un valor controlado por vos es seguro; interpolar input del usuario (un id, un nombre que viene del req.body) es lo que abre la puerta a SQL injection — y eso siempre va con $1. Tenés que poder explicar esta diferencia en el oral.

🎓 Detalle para aprender: extends con arrow functions vs. métodos normales
Si elegís la estrategia A (herencia), vas a chocar con un detalle del estilo del proyecto: los métodos de los repositories están escritos como campos de clase con arrow function (getAllAsync = async () => {...}), no como métodos "normales" (async getAllAsync() {...}). Las dos formas heredan bien, pero no son idénticas.

Forma 1 — CON arrow (campos de clase), el estilo actual del proyecto:

// base-repository.js
export default class BaseRepository {
    constructor(tabla) { this.tabla = tabla; this.db = new Db(); }
    getAllAsync = async () => await this.db.queryAll(`SELECT * FROM ${this.tabla}`);
}

// cursos-repository.js
export default class CursosRepository extends BaseRepository {
    constructor() { super('cursos'); }
    createAsync = async (entity) => { /* INSERT INTO cursos ... */ };
}
Forma 2 — SIN arrow (métodos de prototipo), el estilo "tradicional":

// base-repository.js
export default class BaseRepository {
    constructor(tabla) { this.tabla = tabla; this.db = new Db(); }
    async getAllAsync() { return await this.db.queryAll(`SELECT * FROM ${this.tabla}`); }
}

// cursos-repository.js
export default class CursosRepository extends BaseRepository {
    constructor() { super('cursos'); }
    async createAsync(entity) { /* INSERT INTO cursos ... */ }

    // Solo con esta forma podés "extender" un método común usando super:
    async getAllAsync() {
        const rows = await super.getAllAsync();   // ✅ corre la versión de la base...
        return rows;                              // ...y acá podrías agregarle algo
    }
}
¿En qué se diferencian?
CON arrow (metodo = async () => {})	SIN arrow (async metodo() {})
Dónde vive el método	en cada instancia (campo)	en el prototipo (compartido)
Heredar los métodos comunes	✅ funciona	✅ funciona
Llamar super.getAllAsync() desde el hijo	❌ no funciona (... is not a function)	✅ funciona
Pasar el método como callback suelto (arr.map(repo.getAllAsync))	mantiene this (anda)	pierde this (rompe)
Qué hacer en este ejercicio
La estrategia A solo hereda los comunes y agrega createAsync/updateAsync (sin super.metodoComun()), así que las dos formas sirven.
Para mantener consistencia con el resto del proyecto, seguí con arrow.
Si necesitás extender un método común con super.x(), pasá ese método puntual a la forma sin arrow.
🤔 Pista de error típico: si "no te anda la herencia", fijate si intentaste hacer super.getAllAsync() sobre un método escrito como arrow-field. Esa es la trampa del estilo del proyecto., decime cual de esas estrategias podria ser la mejor de todas para este ejrcicio. te paso las restricciones:  críticas: "la API pública no debe cambiar", "los tests/Postman tienen que seguir pasando igual", "no rompas el patrón de LogHelper. No me metas ORM, seguí usando pg con SQL crudo, no introduzcas un ORM. Mostrame el el antes y el después en líneas de código ("¿cuántas líneas tenía cada repository antes y cuántas comparten ahora?"). Si no bajó la duplicación, el refactor no sirvió. Verificación del resultado
 Los 5 endpoints de alumnos, cursos y materias siguen respondiendo igual que antes (mismos status codes, mismo JSON). Probalo en Postman antes y después.
 La lógica común está en un solo lugar (si arreglás un bug en getAllAsync, se arregla para todas las entidades).
 Lo específico de cada entidad (nombre de tabla, columnas del INSERT/UPDATE) sigue siendo claro y fácil de cambiar.
 La regla de negocio de alumnos (calcular edad, validar que el curso existe) no se perdió en el refactor.
 No se agregó un ORM ni dependencias nuevas.   

Hecho resumido

Se aplicó herencia (Estrategia A) para eliminar la duplicación de código CRUD en las 3 capas:
Repositories: BaseRepository con getAllAsync, getByIdAsync, deleteByIdAsync parametrizados por nombre de tabla. Cada repositorio concreto (CursosRepository, MateriasRepository) solo aporta createAsync/updateAsync con sus columnas específicas. AlumnosRepository hereda los comunes y define sus propios INSERT/UPDATE con 5 columnas.
Services: BaseService implementa los 5 métodos CRUD como pass-through al repositorio. CursosService y MateriasService son clases triviales que solo pasan su repo al constructor. AlumnosService extiende BaseService y sobrescribe getAllAsync/getByIdAsync con super para inyectar calcularEdad, además de agregar validarCursoExiste.
Controllers: Función factoría createEntityRouter(service) que genera los 5 endpoints estándar (GET, GET/:id, POST, PUT/:id, DELETE/:id) con try/catch y status codes. Cada controlador se reduce a una línea que llama a la factoría.
Resultado: ~495 → ~297 líneas totales. La lógica común vive en un solo lugar; lo específico de cada entidad queda aislado y visible. Sin ORM, sin nuevas dependencias, misma API.

**Auto-chequeo de las 5 partes EFSI** (marcá lo que incluiste):
- [si] Rol
- [si] Contexto (¿pegaste código del proyecto?, no le pase codigo porque uso un agente. le pase la consigna y se la explique bien)
- [si] Tarea
- [si] Restricciones
- [ ] Iteración

**Qué me devolvió (resumen):**

**¿Me sirvió tal cual, o tuve que corregir/repreguntar?**
Si la verdad que me sirvio bastante bien, lo que hice fue preguntarle como lo hizo y como es que funciona la herencia.

### Prompt #2


**Por qué necesité este segundo prompt** (qué falló o faltó en el anterior):

el primer promt lo que hice fue enviarle el promt en modo plan y despues le dije que me lo haga 

*(Repetí la estructura para cada prompt. Si resolviste todo con un solo prompt gigante, ⚠️ eso es 🟡 según EFSI — explicá por qué.)*

Y yo use tres promts porque si solo utilizara uno estoy seguro de que lo haria mal y le falatrian cosas y no estarisa bien estructurado, la ia necesita que le hagan preguntas y que yo tambien se las haga. Si le hago todo un solo promt no estaria bien.

## 3. 🔧 Qué hizo la IA y qué hice yo

Marcá esto **también en el código** con comentarios `// [IA]` y `// [YO]`. Acá resumilo:

| Archivo / función | Lo generó la IA | Lo modifiqué/escribí yo | Por qué |

Archivo	                IA	                          Yo	                           Por qué
base-repository.js	✅ Todo	                          —	                        Clase madre nueva con getAll/getById/deleteById
alumnos-repository.js	Herencia + eliminar comunes	createAsync/updateAsync con columnas	yo  SQL de alumnos intacto
cursos-repository.js	Herencia + eliminar comunes	createAsync/updateAsync con nombre	yo SQL de cursos intacto
materias-repository.js	Herencia + eliminar comunes	createAsync/updateAsync con nombre	 Ídem cursos
base-service.js	✅ Todo	—	Passthrough de 5 CRUD
alumnos-service.js	extends, super, reescritura con super.getAllAsync	calcularEdad, agregarEdad, validarCursoExiste	Tu lógica de negocio igual
cursos-service.js	✅ Hereda todo	—	Antes tenías 5 métodos, ahora 0
materias-service.js	✅ Hereda todo	—	Ídem cursos
base-controller.js	✅ Todo	—	Factoría de 5 endpoints
alumnos-controller.js	Factory reemplaza endpoints comunes	GET /test-insert	Tu endpoint extra sigue igual
cursos-controller.js	✅ Reemplaza todo	—	~75 líneas → 3
materias-controller.js	✅ Reemplaza todo	—	~75 líneas → 3




## 4. 🐛 Errores o cosas mal que detecté en la respuesta de la IA

> Si ponés "ninguno", probablemente no las viste. **Siempre** hay algo (un import de más, un estilo distinto, un caso borde olvidado, una mala práctica de seguridad).

Los errres que se detectaron fue Interpolación de nombre de tabla, sin embargo al charlarlo con la IA me dice que no es un error en si, sino que es seguro porque el valor lo escribís vos en el código (super('alumnos')), nunca el usuario.
## 5. ✅ Verificación

Pegá el checklist de verificación del ejercicio y marcá lo que comprobaste **vos** (con qué evidencia: captura de Postman, salida de `npm test`, número de ms, etc.).

## 6. ✍️ Reflexión (300–600 palabras)

Cubrí: qué proceso seguiste, qué decisiones tomaste y por qué, qué aprendiste, y —lo más importante— **qué corregiste de lo que te dio la IA**. Escribí con tus palabras; esto se contrasta con el oral.

## 7. 🔗 Adjuntos

- [ ] Link/PDF de la conversación completa con la IA
- [ ] Commit(s) en GitHub: `____________`
- [ ] Capturas / evidencias de verificación
