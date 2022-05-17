export default class HttpError extends Error {
  constructor(
    public readonly httpStatusCode: number,
    public readonly message: string,
    public readonly details?: string
  ) {
    super(message);
  }
}
