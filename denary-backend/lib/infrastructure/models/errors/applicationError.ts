
export class ApplicationError extends Error {
    public importanceLevel: ImportanceLevel;

    constructor(message: string, importanceLevel: ImportanceLevel = ImportanceLevel.LOW) {
        super(message);
        this.importanceLevel = importanceLevel;
    }
}

export enum ImportanceLevel { LOW, LOW_MEDIUM, MEDIUM, MEDIUM_HIGH, HIGH }
