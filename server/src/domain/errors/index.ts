export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainError";
  }
}

export class ErrorClient extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ErrorClient";
  }
}

export class DomainToken extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainToken";
  }
}
