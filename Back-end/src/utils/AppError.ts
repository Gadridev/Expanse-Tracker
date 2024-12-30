class AppError extends Error {
  status: string;
  constructor(public message: string, public statusCode: number) {
    super(message);
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
  }
}
export default AppError;
