import { type HttpClient, type HttpClientOptions } from '../types';

export class StubHttpClient implements HttpClient {
  #requestInfo: Request[] = [];
  #responses: Response[] = [];
  #options: Array<HttpClientOptions | undefined> = [];

  async request(
    request: Request,
    options?: HttpClientOptions,
  ): Promise<Response> {
    this.#requestInfo.push(request);
    this.#options.push(options);

    const response = this.#responses.shift();

    return response ?? new Response('{}', { status: 404 });
  }

  get requestInfo(): Request[] {
    return this.#requestInfo;
  }

  get options(): Array<HttpClientOptions | undefined> {
    return this.#options;
  }

  addResponse(body: Record<string, unknown> | string): void {
    const response = new Response(JSON.stringify(body));
    this.#responses.push(response);
  }

  clear(): void {
    this.#requestInfo = [];
    this.#responses = [];
  }
}
