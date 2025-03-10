import { apiRequest } from "./apiRequest";

export class PostPondUseCase {
    constructor(name, area, userId) {
        this.name = name
        this.area = area
        this.userId = userId
    }
}

export class PutPondUseCase {
    constructor(id, name, area) {
        this.id = id
        this.name = name
        this.area = area
    }
}

export async function getPonds(token) {
    return apiRequest('ponds', 'GET', null, token)
}

export async function addPond(pond, token) {
    return apiRequest('ponds', 'POST', pond, token)
}

export async function updatePond(pond, token) {
    return apiRequest('ponds', 'PUT', pond, token)
}

export async function deactivatePond(id, token) {
    return apiRequest(`ponds/deactivate/${id}`, 'DELETE', null, token)
}

