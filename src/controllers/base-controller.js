// [AI] Clase base para controllers con los 5 endpoints CRUD estándar.
// [AI] Cada controller concreto hereda de acá, pasa su service y puede agregar endpoints custom.
// [AI] Los handlers son arrow functions para que this esté atado lexicalmente a la instancia.

import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

export default class BaseController {
    constructor(service, entityName) {
        this.service = service;
        this.entityName = entityName;
        this.router = Router();
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('',        (req, res) => this.getAll(req, res));
        this.router.get('/:id',    (req, res) => this.getById(req, res));
        this.router.post('',       (req, res) => this.create(req, res));
        this.router.put('/:id',    (req, res) => this.update(req, res));
        this.router.delete('/:id', (req, res) => this.deleteById(req, res));
    }

    getRouter() {
        return this.router;
    }

    getAll = async (req, res) => {
        try {
            const returnArray = await this.service.getAllAsync();
            if (returnArray != null) {
                res.status(StatusCodes.OK).json(returnArray);
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error interno.');
            }
        } catch (error) {
            console.log(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error: ${error.message}`);
        }
    }

    getById = async (req, res) => {
        try {
            const returnEntity = await this.service.getByIdAsync(req.params.id);
            if (returnEntity != null) {
                res.status(StatusCodes.OK).json(returnEntity);
            } else {
                res.status(StatusCodes.NOT_FOUND).send(`No se encontro la entidad (id:${req.params.id}).`);
            }
        } catch (error) {
            console.log(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error: ${error.message}`);
        }
    }

    create = async (req, res) => {
        try {
            const newId = await this.service.createAsync(req.body);
            if (newId > 0) {
                res.status(StatusCodes.CREATED).json(newId);
            } else {
                res.status(StatusCodes.BAD_REQUEST).json(null);
            }
        } catch (error) {
            console.log(error);
            res.status(StatusCodes.BAD_REQUEST).send(`Error: ${error.message}`);
        }
    }

    update = async (req, res) => {
        try {
            let id = parseInt(req.params.id);
            let entity = req.body;

            if (entity.id && parseInt(entity.id) !== id) {
                return res.status(StatusCodes.BAD_REQUEST)
                    .send(`El id de la URL (${id}) no coincide con el id del body (${entity.id}).`);
            }

            entity.id = id;
            const rowsAffected = await this.service.updateAsync(entity);
            if (rowsAffected != 0) {
                res.status(StatusCodes.OK).json(rowsAffected);
            } else {
                res.status(StatusCodes.NOT_FOUND).send(`No se encontro la entidad (id:${id}).`);
            }
        } catch (error) {
            console.log(error);
            res.status(StatusCodes.BAD_REQUEST).send(`Error: ${error.message}`);
        }
    }

    deleteById = async (req, res) => {
        try {
            const rowCount = await this.service.deleteByIdAsync(req.params.id);
            if (rowCount != 0) {
                res.status(StatusCodes.OK).json(null);
            } else {
                res.status(StatusCodes.NOT_FOUND).send(`No se encontro la entidad (id:${req.params.id}).`);
            }
        } catch (error) {
            console.log(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error: ${error.message}`);
        }
    }
}
