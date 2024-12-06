export class DbCronError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DbCronError";
  }
}
