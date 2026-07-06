// [AI] Cambio: ahora extiende BaseRepository. El constructor pasa 'materias' a la clase madre.
// [AI] Los métodos comunes se heredan.
// [Student] createAsync y updateAsync conservan su SQL original (columna nombre).

import BaseRepository from './base-repository.js';

export default class MateriasRepository extends BaseRepository {
    constructor() {
        super('materias');
    }

    createAsync = async (entity) => {
        const sql = `INSERT INTO materias (nombre) VALUES ($1) RETURNING id`;
        const values = [entity?.nombre ?? ''];
        return await this.db.queryReturnId(sql, values);
    }

    updateAsync = async (entity) => {
        const sql = `UPDATE materias SET nombre = $2 WHERE id = $1`;
        const values =  [   entity.id, 
                            entity?.nombre ?? ''
                        ];
        return await this.db.queryRowCount(sql, values);
    }
}
