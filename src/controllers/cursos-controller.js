// [AI] Controller de Cursos: extiende BaseController sin agregar endpoints adicionales.
// [AI] Hereda los 5 endpoints CRUD estándar directamente.

import BaseController from './base-controller.js';
import CursosService from './../services/cursos-service.js';

export default class CursosController extends BaseController {
    constructor() {
        super(new CursosService(), 'Curso');
    }
}
