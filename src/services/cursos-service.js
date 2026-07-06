// [AI] Cambio: ahora extiende BaseService. Todo el CRUD se hereda de la clase madre.
// [AI] El único código propio es pasar el repositorio al constructor de BaseService.
// [Student] Anteriormente tenía los 5 métodos escritos manualmente (se eliminaron).

import BaseService from './base-service.js';
import CursosRepository from '../repositories/cursos-repository.js';

export default class CursosService extends BaseService {
    constructor() {
        super(new CursosRepository());
    }
}
