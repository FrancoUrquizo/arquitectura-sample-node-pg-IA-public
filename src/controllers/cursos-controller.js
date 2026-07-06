// [AI] Cambio: todo el controller se reemplazó por una llamada a la factoría createEntityRouter.
// [Student] Antes tenía los 5 endpoints escritos manualmente (se eliminaron).

import createEntityRouter from './base-controller.js';
import CursosService from './../services/cursos-service.js';

export default createEntityRouter(new CursosService());
