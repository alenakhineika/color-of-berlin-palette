export class HttpException extends Error {
  status: number;
  message: string;

  constructor(data: { status: number; message: string }) {
    super(data.message);
    this.status = data.status;
    this.message = data.message;
  }
}
