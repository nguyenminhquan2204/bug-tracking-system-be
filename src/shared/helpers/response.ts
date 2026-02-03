export const DEFAULT_SUCCESS_MESSAGE = 'success';

export const DEFAULT_FAILED_MESSAGE = 'failed';

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  ITEM_NOT_FOUND = 444,
  ITEM_ALREADY_EXIST = 445,
  ITEM_INVALID = 446,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
}

export class SuccessResponse<T = any> {
  code: HttpStatus;
  success: boolean;
  data: T;
  message: string;

  constructor(
    data: T = {} as T,
    message: string = DEFAULT_SUCCESS_MESSAGE,
    code: HttpStatus = HttpStatus.OK,
  ) {
    this.success = true;
    this.data = data;
    this.message = message;
    this.code = code;
  }
}
