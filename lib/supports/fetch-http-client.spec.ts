import { type AddressInfo } from 'node:net';
import Fastify, { type FastifyInstance } from 'fastify';
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { FetchHttpClient } from './fetch-http-client';

describe('FetchHttpClient', () => {
  let fastify: FastifyInstance;

  beforeAll(async () => {
    fastify = Fastify({ logger: false });

    fastify.get('/', async (request, reply) => {
      await reply.send({ hello: 'world' });
    });

    fastify.get('/timeout', async (request, reply) => {
      await new Promise((resolve) => setTimeout(resolve, 10000));
      await reply.send({ hello: 'world' });
    });

    await fastify.listen({ port: 0 });
  });

  afterAll(async () => {
    await fastify.close();
  });

  test('should request successfully', async () => {
    // given
    const address = fastify.server.address() as AddressInfo;
    const httpClient = new FetchHttpClient(5000);
    const request = new Request(`http://localhost:${address.port}/`);

    // when
    const response = await httpClient.request(request);

    // then
    expect(await response.json()).toEqual({ hello: 'world' });
  });

  test('should throw error when timeout', async () => {
    // given
    const address = fastify.server.address() as AddressInfo;
    const httpClient = new FetchHttpClient(3000);
    const request = new Request(`http://localhost:${address.port}/timeout`);

    // when
    const doRequest = async (): Promise<Response> =>
      await httpClient.request(request);

    // then
    await expect(doRequest).rejects.toThrowError('Request Timeout: 3000ms');
  });
});
