export interface IErrorSource {
  path: string;
  message: string;
}

export interface IErrorResponse {
  statusCode?: number;
  success: boolean;
  message: string;
  errorSources: IErrorSource[];
  stack?: string;
  error?: unknown;
}
