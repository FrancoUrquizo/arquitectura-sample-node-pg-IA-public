// [AI] Cambio: todo el controller se reemplazó por una llamada a la factoría createEntityRouter.
// [Student] Antes tenía los 5 endpoints escritos manualmente (se eliminaron).

import createEntityRouter from './base-controller.js';
import MateriasService from './../services/materias-service.js';

export default createEntityRouter(new MateriasService());
