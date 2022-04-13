export class DapperError extends Error {
  static FETCH_ERROR: 600;
  static JSON_ERROR: 601;
  static VALIDATION_ERROR: 602;

  code: number;
  url?: string;

  constructor(message: string, url?: string, code = 0) {
    super(message);
    this.name = "DapperError";
    this.url = url;
    this.code = code;
  }
}
