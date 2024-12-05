export class SwappError extends Error {}

export class SwapiError extends SwappError {
  callDetails: CallDetails;
  constructor(message: string, callDetails: CallDetails) {
    super(message);
    this.name = "SwapiError";
    this.callDetails = callDetails;
  }
}

type CallDetails = {
  url: string;
  statusCode: number;
  error: string;
};
