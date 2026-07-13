// [IA] Cambio: ahora extiende BaseService. El repositorio se pasa al constructor de la clase madre.
// [IA] getAllAsync y getByIdAsync se sobrescriben con super para inyectar calcularEdad.
// [IA] createAsync y updateAsync ahora usan this.repository en vez de this.AlumnosRepository.
// [IA] Refactorizado: calcularEdad y agregarEdad se extrajeron a src/helpers/fechas-helper.js
// [YO] Prompt: "sacá calcularEdad y agregarEdad de acá a un helper reutilizable"
// [YO] Decisión: solo importar agregarEdad (calcularEdad es uso interno del helper)

import BaseService from './base-service.js';
import AlumnosRepository from '../repositories/alumnos-repository.js';
import CursosService from './cursos-service.js';
// [IA] Import desde fechas-helper — las funciones ya no están definidas acá
import { agregarEdad } from '../helpers/fechas-helper.js';

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
