export class SwappError extends Error {}

export class SwapiError extends SwappError {
    public callDetails: {
        statusCode: number,
        responseData?: any;
    }

    constructor(statusCode?: number, responseData?: any) {
        super('Unable to retrieve data from SW API');
        this.name = "SwapiError";
        this.callDetails = {
            statusCode,
            responseData
        };
    }
}