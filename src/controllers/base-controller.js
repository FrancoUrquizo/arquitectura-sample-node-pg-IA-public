// [AI] Factoría de routers CRUD. Genera los 5 endpoints estándar con try/catch y status codes.
// [AI] Cada controlador la llama con su service específico.
// [AI] Reemplaza el código duplicado que antes existía en los 3 controllers.

import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

export default function createEntityRouter(service) {
    const router = Router();

    router.get('', async (req, res) => {
        try {
            const returnArray = await service.getAllAsync();
            if (returnArray != null) {
                res.status(StatusCodes.OK).json(returnArray);
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error interno.');
            }
        } catch (error) {
            console.log(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error: ${error.message}`);
        }
    });

    router.get('/:id', async (req, res) => {
        try {
            const returnEntity = await service.getByIdAsync(req.params.id);
            if (returnEntity != null) {
                res.status(StatusCodes.OK).json(returnEntity);
            } else {
                res.status(StatusCodes.NOT_FOUND).send(`No se encontro la entidad (id:${req.params.id}).`);
            }
        } catch (error) {
            console.log(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error: ${error.message}`);
        }
    });

    router.post('', async (req, res) => {
        try {
            const newId = await service.createAsync(req.body);
            if (newId > 0) {
                res.status(StatusCodes.CREATED).json(newId);
            } else {
                res.status(StatusCodes.BAD_REQUEST).json(null);
            }
        } catch (error) {
            console.log(error);
            res.status(StatusCodes.BAD_REQUEST).send(`Error: ${error.message}`);
        }
    });

    router.put('/:id', async (req, res) => {
        try {
            let id = parseInt(req.params.id);
            let entity = req.body;

            if (entity.id && parseInt(entity.id) !== id) {
                return res.status(StatusCodes.BAD_REQUEST).send(`El id de la URL (${id}) no coincide con el id del body (${entity.id}).`);
            }

            entity.id = id;
            const rowsAffected = await service.updateAsync(entity);
            if (rowsAffected != 0) {
                res.status(StatusCodes.OK).json(rowsAffected);
            } else {
                res.status(StatusCodes.NOT_FOUND).send(`No se encontro la entidad (id:${id}).`);
            }
        } catch (error) {
            console.log(error);
            res.status(StatusCodes.BAD_REQUEST).send(`Error: ${error.message}`);
        }
    });

    router.delete('/:id', async (req, res) => {
        try {
            const rowCount = await service.deleteByIdAsync(req.params.id);
            if (rowCount != 0) {
                res.status(StatusCodes.OK).json(null);
            } else {
                res.status(StatusCodes.NOT_FOUND).send(`No se encontro la entidad (id:${req.params.id}).`);
            }
        } catch (error) {
            console.log(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error: ${error.message}`);
        }
    });

    return router;
}
