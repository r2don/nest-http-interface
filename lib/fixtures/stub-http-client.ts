import { type HttpClient } from '../types/http-client.interface';

export class StubHttpClient implements HttpClient {
  #requestInfo: Request[] = [];
  #responses: Response[] = [];

  async request(request: Request): Promise<Response> {
    this.#requestInfo.push(request);

    const response = this.#responses.shift();

    if (typeof response === 'undefined') {
      throw new Error('empty response array');
    }

    return response;
  }

  get requestInfo(): Request[] {
    return this.#requestInfo;
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
