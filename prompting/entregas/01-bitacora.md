# 📓 Bitácora de Prompts — Ejercicio N° ___

> Copiá este archivo por cada ejercicio que entregues. Nombralo, por ejemplo, `entregas/01-bitacora.md`.
> Esta bitácora **es parte de la nota**. Un ejercicio sin bitácora no se corrige.

---

## Datos

- **Alumno/a:** Franco Urquizo y Facundo Angel
- **Ejercicio:** N° 1 — Nueva tabla y su CRUD
- **Fecha:** 03/07/26
- **Modelo de IA usado:** (ej: ChatGPT, Claude, Gemini, Copilot) opencoode / Gemini

---

## 1. 🎯 Qué me pidieron

Resumí en 2–3 líneas el objetivo del ejercicio con tus palabras (no copiado del enunciado).

Bueno lo que me piedieron es pedirle a la IA enbase a un buen promt que me haga el primer ejercicio el cual es crear una nueva tabla y su crud. la nueva tabla es materias 

## 2. 💬 Mis prompts (en orden)

Pegá **todos** los prompts que usaste, en orden, con la respuesta resumida y qué hiciste con ella. Agregá tantos como necesites.

### Prompt #1

**Lo que escribí:**
hola, quiero que actues como un profesional desarrollador backender  Node/Express. Te paso el contexto: Marcar en el código con // [IA] y // [YO], El proyecto tiene dos entidades: alumnos y cursos. Cada una tiene su tríada completa:

src/controllers/alumnos-controller.js
src/services/alumnos-service.js
src/repositories/alumnos-repository.js
(y lo mismo para cursos).

Queremos agregar una tabla nueva: materias. Tiene que quedar enchufada igual que las otras dos, expuesta en /api/materias con los 5 endpoints CRUD.

Aprovechamos para dejar creada también la tabla calificaciones, que relaciona alumnos con materias. En este ejercicio solo hacés el CRUD de materias (simple, parecido a cursos). La tabla calificaciones es más rica —tiene FKs, una restricción de unicidad y reglas de negocio (notas de 0 a 10, no duplicar alumno+materia, JOINs para traer nombres)— y te va a servir como entidad de práctica en los ejercicios siguientes (validaciones en el 04, performance y JOINs en el 08). Script SQL (creá las dos tablas)
-- Tabla materias
CREATE TABLE materias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(75) NOT NULL
);

-- Tabla calificaciones
-- Cada alumno tiene UNA sola calificación por materia (no se repite la combinación alumno+materia).
CREATE TABLE calificaciones (
    id SERIAL PRIMARY KEY,
    id_alumno INT NOT NULL REFERENCES alumnos(id),
    id_materia INT NOT NULL REFERENCES materias(id),
    nota INT NOT NULL,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    UNIQUE(id_alumno, id_materia)
);

-- Datos de prueba para materias
INSERT INTO materias (nombre) VALUES ('Matemática');
INSERT INTO materias (nombre) VALUES ('Lengua');
INSERT INTO materias (nombre) VALUES ('Historia');
INSERT INTO materias (nombre) VALUES ('Programación');
INSERT INTO materias (nombre) VALUES ('Base de Datos');
Las calificaciones no se siembran: las vas a crear desde la API (POST) cuando llegues a los ejercicios que usan esa tabla. Qué tenés que lograr
Ejecutar el script SQL de arriba para crear materias y calificaciones (+ los datos de prueba de materias).
materias-repository.js, materias-service.js, materias-controller.js siguiendo exactamente el patrón de cursos (que es el CRUD más simple del proyecto).
Registrar el controller en src/server.js (app.use("/api/materias", ...)).
Probar los 5 endpoints con Postman y exportar la collection.. Tu tarea en si es generar las 3 capas para materias. Restricciones: sin dependencias nuevas, mismo estilo (clases, delegar el acceso a datos en la clase DbPg con this.db.queryAll/queryOne/queryReturnId/queryRowCount, queries $1), mantener los console.log., primero el repository, espués el service y el controller. Generá de a una capa


Hecho resumido


hecho. Resumen de lo creado/modificado:
Archivo	Acción
src/repositories/materias-repository.js	Creado — 5 métodos CRUD contra materias
src/services/materias-service.js	Creado — delega en repository
src/controllers/materias-controller.js	Creado — 5 endpoints REST
src/entities/materia.js	Creado — clase con nombre
src/server.js	Modificado — import y ruta /api/materias
documents/database/script-postgress.sql	Modificado — añadidas tablas materias, calificaciones + seeds
documents/postman/...materias.postman_collection.json	Creado — collection con los 5 endpoints de materias (+ los existentes)
```

**Auto-chequeo de las 5 partes EFSI** (marcá lo que incluiste):
- [si] Rol
- [si] Contexto (¿pegaste código del proyecto?, no le pase codigo porque uso un agente. le pase la consigna y se la explique bien)
- [si] Tarea
- [si] Restricciones
- [ ] Iteración

**Qué me devolvió (resumen):**
lo que me dovolvio es que primero cree las tablas de materias y calificaciones, y tambien inserte las 5 materias como lengua, matematuca, historia, programacion y base de datos. Me creo MateriasRepository, MateriasService y MateriasControllercon cos sus respectivos crud

**¿Me sirvió tal cual, o tuve que corregir/repreguntar?**
si, me sirvio y tuve que hacer otro promt porque primero le pedi que me haga por partes las capas y ademas la otra clase me quede sin tiempo.

### Prompt #2

📋 El problema
El proyecto tiene dos entidades: alumnos y cursos. Cada una tiene su tríada completa:

src/controllers/alumnos-controller.js
src/services/alumnos-service.js
src/repositories/alumnos-repository.js
(y lo mismo para cursos).

Queremos agregar una tabla nueva: materias. Tiene que quedar enchufada igual que las otras dos, expuesta en /api/materias con los 5 endpoints CRUD.

Aprovechamos para dejar creada también la tabla calificaciones, que relaciona alumnos con materias. En este ejercicio solo hacés el CRUD de materias (simple, parecido a cursos). La tabla calificaciones es más rica —tiene FKs, una restricción de unicidad y reglas de negocio (notas de 0 a 10, no duplicar alumno+materia, JOINs para traer nombres)— y te va a servir como entidad de práctica en los ejercicios siguientes (validaciones en el 04, performance y JOINs en el 08).

Script SQL (creá las dos tablas)
-- Tabla materias
CREATE TABLE materias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(75) NOT NULL
);

-- Tabla calificaciones
-- Cada alumno tiene UNA sola calificación por materia (no se repite la combinación alumno+materia).
CREATE TABLE calificaciones (
    id SERIAL PRIMARY KEY,
    id_alumno INT NOT NULL REFERENCES alumnos(id),
    id_materia INT NOT NULL REFERENCES materias(id),
    nota INT NOT NULL,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    UNIQUE(id_alumno, id_materia)
);

-- Datos de prueba para materias
INSERT INTO materias (nombre) VALUES ('Matemática');
INSERT INTO materias (nombre) VALUES ('Lengua');
INSERT INTO materias (nombre) VALUES ('Historia');
INSERT INTO materias (nombre) VALUES ('Programación');
INSERT INTO materias (nombre) VALUES ('Base de Datos');
Las calificaciones no se siembran: las vas a crear desde la API (POST) cuando llegues a los ejercicios que usan esa tabla.

📦 Qué tenés que lograr
Ejecutar el script SQL de arriba para crear materias y calificaciones (+ los datos de prueba de materias).
materias-repository.js, materias-service.js, materias-controller.js siguiendo exactamente el patrón de cursos (que es el CRUD más simple del proyecto).
Registrar el controller en src/server.js (app.use("/api/materias", ...)).
Probar los 5 endpoints con Postman y exportar la collection.
🤖 Cómo encarar el prompting
⚠️ Trampa: si le pedís "hacé el CRUD de materias" sin pasarle el código existente, la IA te va a inventar un estilo distinto (probablemente con un ORM, o con otra forma de manejar el Pool). Después no va a encajar y vas a perder más tiempo arreglándolo que escribiéndolo vos.

Tu prompt tiene que incluir, mínimo:

Rol: desarrollador backend Node/Express.
Contexto: arquitectura en capas, pg sin ORM, ES modules, y pegar cursos-repository.js, cursos-service.js y db-pg.js como referencia de estilo (cursos es el CRUD más parecido al de materias).
Tarea: generar las 3 capas para materias.
Restricciones: sin dependencias nuevas, mismo estilo (clases, delegar el acceso a datos en la clase DbPg con this.db.queryAll/queryOne/queryReturnId/queryRowCount, queries $1), mantener los console.log.
Iteración: pedir primero el repository, revisarlo, después el service y el controller.
💡 Tip: Generá de a una capa. Si pedís las 3 juntas es más difícil revisar y la IA tiende a tomar atajos. Repository → la revisás → service → la revisás → controller. segui lon que comenzaste la vez pasada, completa lo que te falto la otra vez


encontra alguna vulnerabilidad en los crud que escribiste. Actua como un desarrollador porfesional especializado en node.js, el cual tu rol es ver todas las vulnerabilidades de un proyecto 

**Por qué necesité este segundo prompt** (qué falló o faltó en el anterior):

Lo que paso es que en el primer promt, le pedi que me lo haga por una capa a la vez, este promt es pare que me pueda terminar lo que ya habia empezado.

*(Repetí la estructura para cada prompt. Si resolviste todo con un solo prompt gigante, ⚠️ eso es 🟡 según EFSI — explicá por qué.)*

Y yo use tres promts porque si solo utilizara uno estoy seguro de que lo haria mal y le falatrian cosas y no estarisa bien estructurado, la ia necesita que le hagan preguntas y que yo tambien se las haga. Si le hago todo un solo promt no estaria bien.

## 3. 🔧 Qué hizo la IA y qué hice yo

Marcá esto **también en el código** con comentarios `// [IA]` y `// [YO]`. Acá resumilo:

| Archivo / función | Lo generó la IA | Lo modifiqué/escribí yo | Por qué |
|materias-repository| IA |---||
| materias-services| IA| | |
| materias-controler|IA | | |





## 4. 🐛 Errores o cosas mal que detecté en la respuesta de la IA

> Si ponés "ninguno", probablemente no las viste. **Siempre** hay algo (un import de más, un estilo distinto, un caso borde olvidado, una mala práctica de seguridad).

algunos de los que estan y se vieron y tambien le pregunte a la IA son: Sin validación de longitud en capa de aplicación, el cual es que  La columna nombre está definida como VARCHAR(75) en PostgreSQL, pero el código JavaScript nunca verifica que el valor recibido cumpla con ese límite. Si un usuario/envía un nombre de más de 75 caracteres, la base de datos lo rechaza con un error interno (que además se filtra al cliente), en lugar de recibir un mensaje claro indicando que el máximo es 75 caracteres. La validación debe hacerse en el controller antes de llegar al repository.

## 5. ✅ Verificación

Pegá el checklist de verificación del ejercicio y marcá lo que comprobaste **vos** (con qué evidencia: captura de Postman, salida de `npm test`, número de ms, etc.).

- [si] Rol
- [si] Contexto (¿pegaste código del proyecto?, no le pase codigo porque uso un agente. le pase la consigna y se la explique bien)
- [si] Tarea
- [si] Restricciones
- [si] Iteración

## 6. ✍️ Reflexión (300–600 palabras)

Cubrí: qué proceso seguiste, qué decisiones tomaste y por qué, qué aprendiste, y —lo más importante— **qué corregiste de lo que te dio la IA**. Escribí con tus palabras; esto se contrasta con el oral.

Lo que reflexiono sobre este ejercico es que lo que primero que hice fue leeer bien el enunciado de el TP, luego lo que hice fue crear un buen promt el cual lo tuvo que seguir en otro promt porque me quede sin tiempo y la IA me hizo lo que le pedi. Tambien le pedi que me diga una de las vulnarabilidades y me dijo que habia el eror de Sin validación de longitud en capa de aplicación, el cual es que  La columna nombre está definida como VARCHAR(75) en PostgreSQL, pero el código JavaScript nunca verifica que el valor recibido cumpla con ese límite. Si un usuario/envía un nombre de más de 75 caracteres, la base de datos lo rechaza con un error interno (que además se filtra al cliente), en lugar de recibir un mensaje claro indicando que el máximo es 75 caracteres. La validación debe hacerse en el controller antes de llegar al repository. Luego lo que paso es que revise y estaba bien el tp , tambien lo revise por postman. 

## 7. 🔗 Adjuntos

- [ ] Link/PDF de la conversación completa con la IA
- [ ] Commit(s) en GitHub: https://github.com/FrancoUrquizo/arquitectura-sample-node-pg-IA-public.git
- [ ] Capturas / evidencias de verificación
