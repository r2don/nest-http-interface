import { type HttpClient } from '../types/http-client.interface';

export class FetchHttpClient implements HttpClient {
  #timeout: number;

  constructor(timeout: number) {
    this.#timeout = timeout;
  }

  async request(request: Request): Promise<Response> {
    const controller = new AbortController();

    return await Promise.race<Response>([
      fetch(request, { signal: controller.signal }),
      new Promise((resolve, reject) =>
        setTimeout(() => {
          controller.abort();
          reject(new Error(`Request Timeout: ${this.#timeout}ms`));
        }, this.#timeout),
      ),
    ]);
  }
}
