class ErrorResponse extends Error {
  constructor(public statusCode: number, public errorMessage: string) {
    super(errorMessage);
    this.statusCode = statusCode;
  }
}

export default ErrorResponse;
