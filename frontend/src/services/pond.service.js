import { v4 } from "uuid";

export class PostPondUseCase {
    constructor(name, area, userId) {
        this.name = name
        this.area = area
        this.userId = userId
        this.dataType = 'pond'
        this._id = v4()
    }
}

export class PutPondUseCase {
    constructor(id, name, area) {
        this.id = id
        this.name = name
        this.area = area
    }
}