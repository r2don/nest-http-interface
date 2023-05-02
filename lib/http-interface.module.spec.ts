import { Test } from '@nestjs/testing';
import { describe, expect, test } from 'vitest';
import { GetExchange, HttpInterface } from './decorators';
import { StubHttpClient } from './fixtures/stub-http-client';
import { HttpInterfaceModule } from './http-interface.module';
import { imitation } from './supports';
import { FetchHttpClient } from './supports/fetch-http-client';
import { NodeFetchInjector } from './supports/node-fetch.injector';
import { type HttpClient } from './types';

describe('HttpInterfaceModule', () => {
  @HttpInterface('http://localhost:3000')
  class TestHttpService {
    @GetExchange('/api/v1/test')
    async request(): Promise<string> {
      return imitation();
    }
  }

  test('should use default http client if not given', async () => {
    // given
    const module = await Test.createTestingModule({
      imports: [HttpInterfaceModule.forRoot()],
    }).compile();
    await module.init();
    const app = module.createNestApplication();

    // when
    const injector = app.get<{ httpClient: HttpClient }>(NodeFetchInjector);

    // then
    expect(injector.httpClient).toBeInstanceOf(FetchHttpClient);
  });

  test('should request with given client', async () => {
    // given
    const httpClient = new StubHttpClient();
    const module = await Test.createTestingModule({
      imports: [HttpInterfaceModule.forRoot({ httpClient })],
      providers: [TestHttpService],
    }).compile();
    await module.init();
    const app = module.createNestApplication();
    const service = app.get(TestHttpService);
    httpClient.addResponse({ data: 'ok' });

    // when
    const response = await service.request();

    // then
    expect(response).toBe('{"data":"ok"}');
    await app.close();
  });
});
