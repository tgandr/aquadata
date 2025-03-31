export class PostCultivationUseCase {
    constructor(
        pondNumber,
        stock,
        plOrigin,
        uniformity,
        settlementDate,
        waterAndAcclimationChecked,
        pondId
    ) {
        this.pondNumber = pondNumber;
        this.stock = stock;
        this.plOrigin = plOrigin;
        this.uniformity = uniformity;
        this.settlementDate = settlementDate;
        this.waterAndAcclimationChecked = waterAndAcclimationChecked;
        this.pondId = pondId;
    }

    addStressTest(stressTest) {
        this.stressTest = stressTest
    }

    addWaterAndAcclimation(waterAndAcclimation) {
        this.waterAndAcclimation = waterAndAcclimation
    }
}

export class StressTest {
    constructor(
        stressType,
        deadLarvae,
        swimmingResponse,
    ) {
        this.stressType = stressType;
        this.deadLarvae = deadLarvae;
        this.swimmingResponse = swimmingResponse;
    }
}

export class WaterAndAcclimation {
    constructor (
        oxygen,
        temperature,
        ph,
        salinity,
        ammonia,
        nitrite
    ){
        this.oxygen = oxygen
        this.temperature = temperature
        this.ph = ph
        this.salinity = salinity
        this.ammonia = ammonia
        this.nitrite = nitrite
    }
}