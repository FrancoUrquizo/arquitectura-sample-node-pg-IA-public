// [IA] Helper de respuestas HTTP: centraliza el formato de status codes y bodies
// [IA] para que los controllers no repitan lógica de respuesta endpoint por endpoint.
// [YO] Prompt: "creá un helper de respuestas con responderOk, responderNotFound, responderError..."
// [YO] Decisión: funciones sueltas (no clase) porque no necesitan estado.

import { StatusCodes } from 'http-status-codes';

// [IA] 6 funciones exportadas — el StatusCodes vive acá, no en los controllers
export function responderOk(res, data) {
    res.status(StatusCodes.OK).json(data);
}

export function responderCreated(res, data) {
    res.status(StatusCodes.CREATED).json(data);
}

export function responderNotFound(res, message) {
    res.status(StatusCodes.NOT_FOUND).send(message);
}

export function responderBadRequest(res, message) {
    res.status(StatusCodes.BAD_REQUEST).send(message);
}

export function responderInternalServerError(res, message) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(message);
}

// [YO] Decisión: statusCode opcional con default INTERNAL_SERVER_ERROR,
// [YO] porque create y update usan BAD_REQUEST en el catch, no INTERNAL_SERVER_ERROR
export function responderError(res, error, statusCode = StatusCodes.INTERNAL_SERVER_ERROR) {
    console.log(error);
    res.status(statusCode).send(`Error: ${error.message}`);
}
