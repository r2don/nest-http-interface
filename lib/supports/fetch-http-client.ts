import { type HttpClient, type HttpClientOptions } from '../types';

export class FetchHttpClient implements HttpClient {
  readonly #timeout: number;

  constructor(timeout: number) {
    this.#timeout = timeout;
  }

  async request(
    request: Request,
    options?: HttpClientOptions,
  ): Promise<Response> {
    const timeout = options?.timeout ?? this.#timeout;

    return await fetch(request, { signal: AbortSignal.timeout(timeout) });
  }
}
