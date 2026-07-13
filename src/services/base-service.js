// [AI] Clase base para services con los 5 métodos CRUD como pass-through al repositorio.
// [AI] getAllAsync y getByIdAsync están como métodos de prototipo (no arrow) para permitir
// [AI] que AlumnosService los sobrescriba llamando super.getAllAsync() / super.getByIdAsync().

export default class BaseService {
    constructor(repository) {
        this.repository = repository;
    }

    async getAllAsync() {
        return await this.repository.getAllAsync();
    }

    async getByIdAsync(id) {
        return await this.repository.getByIdAsync(id);
    }

    async createAsync(entity) {
        return await this.repository.createAsync(entity);
    }

    async updateAsync(entity) {
        return await this.repository.updateAsync(entity);
    }

    async deleteByIdAsync(id) {
        return await this.repository.deleteByIdAsync(id);
    }
}
