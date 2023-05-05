import { type AddressInfo } from 'node:net';
import Fastify, {
  type FastifyInstance,
  type FastifyReply,
  type FastifyRequest,
} from 'fastify';
import { createSchema, createYoga } from 'graphql-yoga';
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

    const yoga = createYoga<{
      req: FastifyRequest;
      reply: FastifyReply;
    }>({
      schema: createSchema({
        typeDefs: /* GraphQL */ `
          type Query {
            item(id: Int): String
          }
        `,
        resolvers: { Query: { item: () => 'success' } },
      }),
    });

    fastify.route({
      url: '/graphql',
      method: 'POST',
      handler: async (req, reply) => {
        const response = await yoga.handleNodeRequest(req, {
          req,
          reply,
        });
        void reply.status(response.status);
        void reply.send(response.body);

        return await reply;
      },
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

  test('should request graphql successfully', async () => {
    // given
    const address = fastify.server.address() as AddressInfo;
    const httpClient = new FetchHttpClient(5000);
    const request = new Request(`http://localhost:${address.port}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: /* GraphQL */ `
          query item($id: Int!) {
            item(id: $id)
          }
        `,
        variables: { id: 1 },
      }),
    });

    // when
    const response = await httpClient.request(request);

    // then
    expect(await response.json()).toEqual({ data: { item: 'success' } });
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

  test('should use given option if provided', async () => {
    // given
    const address = fastify.server.address() as AddressInfo;
    const httpClient = new FetchHttpClient(60000);
    const request = new Request(`http://localhost:${address.port}/timeout`);
    const httpClientOptions = { timeout: 300 };

    // when
    const doRequest = async (): Promise<Response> =>
      await httpClient.request(request, httpClientOptions);

    // then
    await expect(doRequest).rejects.toThrowError('Request Timeout: 300ms');
  });
});
