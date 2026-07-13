// [AI] Controller de Alumnos: extiende BaseController y agrega el endpoint GET /test-insert.
// [AI] test-insert se registra ANTES de los routes base para que no lo capture la ruta /:id.

import { StatusCodes } from 'http-status-codes';
import BaseController from './base-controller.js';
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
                res.status(StatusCodes.CREATED).json({
                    message : `Se creó el alumno desde código con id: ${newId}`,
                    alumno  : nuevoAlumno,
                    newId   : newId
                });
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({ message: 'No se pudo crear el alumno.' });
            }
        } catch (error) {
            console.log(error);
            res.status(StatusCodes.BAD_REQUEST).send(`Error: ${error.message}`);
        }
    }
}
