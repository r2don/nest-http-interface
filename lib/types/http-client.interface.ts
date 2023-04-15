export interface HttpClient {
  request: (request: Request) => Promise<Response>;
}
