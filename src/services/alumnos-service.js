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
