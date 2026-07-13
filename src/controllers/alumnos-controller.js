// [IA] Controller de Alumnos: extiende BaseController y agrega el endpoint GET /test-insert.
// [IA] test-insert se registra ANTES de los routes base para que no lo capture la ruta /:id.
// [IA] Refactorizado: respuestas HTTP delegadas a respuestas-helper.js
// [YO] Prompt: "refactorizá alumnos-controller para usar el helper de respuestas"
// [YO] Decisión: importar solo las funciones que testInsert necesita (responderCreated, responderBadRequest, responderError)

import BaseController from './base-controller.js';
import { responderCreated, responderBadRequest, responderError } from '../helpers/respuestas-helper.js';
import { StatusCodes } from 'http-status-codes';
import AlumnosService from './../services/alumnos-service.js';
import Alumno from './../entities/alumno.js';

export default class AlumnosController extends BaseController {
    constructor() {
        super(new AlumnosService(), 'Alumno');
    }

    registerRoutes() {
        this.router.get('/test-insert', (req, res) => this.testInsert(req, res));
        super.registerRoutes();
    }

    testInsert = async (req, res) => {
        try {
            const nuevoAlumno = new Alumno('Willy', 'Wonka', 1, '2005-07-15', true);
            const newId = await this.service.createAsync(nuevoAlumno);
            if (newId > 0) {
                responderCreated(res, {
                    message : `Se creó el alumno desde código con id: ${newId}`,
                    alumno  : nuevoAlumno,
                    newId   : newId
                });
            } else {
                responderBadRequest(res, 'No se pudo crear el alumno.');
            }
        } catch (error) {
            responderError(res, error, StatusCodes.BAD_REQUEST);
        }
    }
}
