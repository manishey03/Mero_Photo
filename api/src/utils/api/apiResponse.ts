import type { Response } from 'express';

// Making Error Response consistent
class ApiResponse {
  #res: Response;
  #success: boolean;
  #statusCode: number;

  #message?: string;

  #metadata: object | undefined = undefined;
  #paginationData: object | undefined = undefined;

  /**
   *
   * @param response Express response object
   * @param code Status code for the response
   */
  constructor(response: Response, code?: number) {
    this.#res = response;
    this.#success = true;
    this.#statusCode = code ?? 200;
  }

  /**
   * Adds pagination values
   */
  paginate(data: object): Omit<ApiResponse, 'paginate'> {
    this.#paginationData = data;
    return this;
  }

  /**
   *
   */
  updateSuccess(data: boolean): Omit<ApiResponse, 'updateSuccess'> {
    this.#success = data;
    return this;
  }

  /**
   * Adds metadata
   */
  addMetadata(data: object): Omit<ApiResponse, 'addMetadata'> {
    this.#metadata = data;
    return this;
  }

  /**
   * Adds response message
   */
  addMessage(message: string): Omit<ApiResponse, 'addMessage'> {
    this.#message = message;
    return this;
  }

  /**
   * Send the response
   */
  send(responseData: object, message?: string) {
    this.#res.status(this.#statusCode).json({
      success: this.#success,
      message: message ?? this.#message ?? 'API operation successfully executed',
      data: responseData,
      ...(this.#metadata ? { metadata: this.#metadata } : {}),
      ...(this.#paginationData ? { pagination: this.#paginationData } : {}),
    });
  }
}

//
export default ApiResponse;
