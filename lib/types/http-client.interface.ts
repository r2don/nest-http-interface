import { type HttpInterfaceConfig } from './http-interface-config';

export type HttpClientOptions = Omit<
  HttpInterfaceConfig,
  'httpClient' | 'transformOption'
>;

export interface HttpClient {
  request: (request: Request, options?: HttpClientOptions) => Promise<Response>;
}
