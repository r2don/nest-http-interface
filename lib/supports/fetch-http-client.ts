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
    const controller = new AbortController();
    const timeout = options?.timeout ?? this.#timeout;

    return await Promise.race<Response>([
      fetch(request, { signal: controller.signal }),
      new Promise((resolve, reject) =>
        setTimeout(() => {
          controller.abort();
          reject(new Error(`Request Timeout: ${timeout}ms`));
        }, timeout),
      ),
    ]);
  }
}
