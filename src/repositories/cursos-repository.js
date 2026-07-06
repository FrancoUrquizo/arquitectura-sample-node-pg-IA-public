// [AI] Cambio: ahora extiende BaseRepository. El constructor pasa 'cursos' a la clase madre.
// [AI] Los métodos comunes (getAllAsync, getByIdAsync, deleteByIdAsync) se heredan.
// [Student] createAsync y updateAsync conservan su SQL original (columna nombre).

import BaseRepository from './base-repository.js';

export default class CursosRepository extends BaseRepository {
    constructor() {
        super('cursos');
    }

    createAsync = async (entity) => {
        const sql = `INSERT INTO cursos (nombre) VALUES ($1) RETURNING id`;
        const values = [entity?.nombre ?? ''];
        return await this.db.queryReturnId(sql, values);
    }

    updateAsync = async (entity) => {
        const sql = `UPDATE cursos SET nombre = $2 WHERE id = $1`;
        const values =  [   entity.id, 
                            entity?.nombre ?? ''
                        ];
        return await this.db.queryRowCount(sql, values);
    }
}
