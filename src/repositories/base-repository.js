// [AI] Clase madre con los 3 métodos comunes: getAllAsync, getByIdAsync, deleteByIdAsync.
// [AI] Cada repositorio concreto hereda de acá y solo pasa el nombre de su tabla.
// [AI] La interpolación de this.tabla es segura porque es una constante interna del desarrollador, no input del usuario.

import Db from './db-pg.js';

export default class BaseRepository {
    constructor(tabla) {
        this.tabla = tabla;
        this.db = new Db();
    }

    getAllAsync = async () => {
        const sql = `SELECT * FROM ${this.tabla}`;
        return await this.db.queryAll(sql);
    }

    getByIdAsync = async (id) => {
        const sql = `SELECT * FROM ${this.tabla} WHERE id=$1`;
        return await this.db.queryOne(sql, [id]);
    }

    deleteByIdAsync = async (id) => {
        const sql = `DELETE FROM ${this.tabla} WHERE id=$1`;
        return await this.db.queryRowCount(sql, [id]);
    }
}
