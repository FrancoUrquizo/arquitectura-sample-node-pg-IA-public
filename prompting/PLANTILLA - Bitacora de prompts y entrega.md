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

```
...
```

---

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
- [ ] Rol
- [ ] Contexto (¿pegaste código del proyecto?)
- [ ] Tarea
- [ ] Restricciones
- [ ] Iteración

**Qué me devolvió (resumen):**
```
...
```

**¿Me sirvió tal cual, o tuve que corregir/repreguntar?**
```
...
```

### Prompt #2

**Lo que escribí:**
```
...
```
**Por qué necesité este segundo prompt** (qué falló o faltó en el anterior):
```
...
```

*(Repetí la estructura para cada prompt. Si resolviste todo con un solo prompt gigante, ⚠️ eso es 🟡 según EFSI — explicá por qué.)*

---

## 3. 🔧 Qué hizo la IA y qué hice yo

Marcá esto **también en el código** con comentarios `// [IA]` y `// [YO]`. Acá resumilo:

| Archivo / función | Lo generó la IA | Lo modifiqué/escribí yo | Por qué |
|---|---|---|---|
| | | | |
| | | | |

---

## 4. 🐛 Errores o cosas mal que detecté en la respuesta de la IA

> Si ponés "ninguno", probablemente no las viste. **Siempre** hay algo (un import de más, un estilo distinto, un caso borde olvidado, una mala práctica de seguridad).

```
...
```

---

## 5. ✅ Verificación

Pegá el checklist de verificación del ejercicio y marcá lo que comprobaste **vos** (con qué evidencia: captura de Postman, salida de `npm test`, número de ms, etc.).

```
...
```

---

## 6. ✍️ Reflexión (300–600 palabras)

Cubrí: qué proceso seguiste, qué decisiones tomaste y por qué, qué aprendiste, y —lo más importante— **qué corregiste de lo que te dio la IA**. Escribí con tus palabras; esto se contrasta con el oral.

```
...
```

---

## 7. 🔗 Adjuntos

- [ ] Link/PDF de la conversación completa con la IA
- [ ] Commit(s) en GitHub: `____________`
- [ ] Capturas / evidencias de verificación
