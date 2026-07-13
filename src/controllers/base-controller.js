// [IA] Clase base para controllers con los 5 endpoints CRUD estándar.
// [IA] Cada controller concreto hereda de acá, pasa su service y puede agregar endpoints custom.
// [IA] Los handlers son arrow functions para que this esté atado lexicalmente a la instancia.
// [IA] Refactorizado: respuestas HTTP delegadas a respuestas-helper.js
// [YO] Prompt: "refactorizá base-controller para usar responderOk, responderNotFound, etc."
// [YO] Decisión: importar respuestas-helper + mantener StatusCodes para los catch de BAD_REQUEST

import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
// [IA] Import de las 6 funciones del helper — reemplaza los res.status(...).send/json() sueltos
import { responderOk, responderCreated, responderNotFound, responderBadRequest, responderInternalServerError, responderError } from '../helpers/respuestas-helper.js';

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
                responderOk(res, returnArray);
            } else {
                responderInternalServerError(res, 'Error interno.');
            }
        } catch (error) {
            responderError(res, error);
        }
    }

    getById = async (req, res) => {
        try {
            const returnEntity = await this.service.getByIdAsync(req.params.id);
            if (returnEntity != null) {
                responderOk(res, returnEntity);
            } else {
                responderNotFound(res, `No se encontro la entidad (id:${req.params.id}).`);
            }
        } catch (error) {
            responderError(res, error);
        }
    }

    create = async (req, res) => {
        try {
            const newId = await this.service.createAsync(req.body);
            if (newId > 0) {
                responderCreated(res, newId);
            } else {
                responderBadRequest(res, null);
            }
        } catch (error) {
            responderError(res, error, StatusCodes.BAD_REQUEST);
        }
    }

    update = async (req, res) => {
        try {
            let id = parseInt(req.params.id);
            let entity = req.body;

            if (entity.id && parseInt(entity.id) !== id) {
                return responderBadRequest(res, `El id de la URL (${id}) no coincide con el id del body (${entity.id}).`);
            }

            entity.id = id;
            const rowsAffected = await this.service.updateAsync(entity);
            if (rowsAffected != 0) {
                responderOk(res, rowsAffected);
            } else {
                responderNotFound(res, `No se encontro la entidad (id:${id}).`);
            }
        } catch (error) {
            responderError(res, error, StatusCodes.BAD_REQUEST);
        }
    }

    deleteById = async (req, res) => {
        try {
            const rowCount = await this.service.deleteByIdAsync(req.params.id);
            if (rowCount != 0) {
                responderOk(res, null);
            } else {
                responderNotFound(res, `No se encontro la entidad (id:${req.params.id}).`);
            }
        } catch (error) {
            responderError(res, error);
        }
    }
}
