// [AI] Controller de Materias: extiende BaseController sin agregar endpoints adicionales.
// [AI] Hereda los 5 endpoints CRUD estándar directamente.

import BaseController from './base-controller.js';
import MateriasService from './../services/materias-service.js';

export default class MateriasController extends BaseController {
    constructor() {
        super(new MateriasService(), 'Materia');
    }
}
