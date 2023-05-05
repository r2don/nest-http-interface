import { type HttpInterfaceConfig } from '../http-interface.module';

export type HttpClientOptions = Omit<HttpInterfaceConfig, 'httpClient'>;

export interface HttpClient {
  request: (request: Request, options?: HttpClientOptions) => Promise<Response>;
}
