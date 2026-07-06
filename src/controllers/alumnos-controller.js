// [AI] Cambio: los 5 endpoints CRUD ahora se generan con createEntityRouter (factoría).
// [Student] El endpoint GET /test-insert se conserva intacto, agregado después de la factoría.

import { StatusCodes } from 'http-status-codes';
import createEntityRouter from './base-controller.js';
import AlumnosService from './../services/alumnos-service.js';
import Alumno from './../entities/alumno.js';

const currentService = new AlumnosService();
const router = createEntityRouter(currentService);

router.get('/test-insert', async (req, res) => {
    try {
        const nuevoAlumno = new Alumno('Willy', 'Wonka', 1, '2005-07-15', true);
        const newId = await currentService.createAsync(nuevoAlumno);
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
});

export default router;
