import { MetadataScanner } from '@nestjs/core';
import { beforeEach, describe, test, expect } from 'vitest';
import {
  DeleteExchange,
  GetExchange,
  HeadExchange,
  HttpInterface,
  OptionsExchange,
  PatchExchange,
  PathVariable,
  PostExchange,
  PutExchange,
  RequestBody,
  RequestForm,
  RequestHeader,
  RequestParam,
} from './decorators';
import { StubDiscoveryService } from './fixtures/stub-discovery.service';
import { StubHttpClient } from './fixtures/stub-http-client';
import { NodeFetchInjector } from './node-fetch.injector';

describe('NodeFetchInjector', () => {
  const metadataScanner = new MetadataScanner();
  const httpClient = new StubHttpClient();
  const discoveryService = new StubDiscoveryService();
  const nodeFetchInjector = new NodeFetchInjector(
    metadataScanner,
    discoveryService,
    httpClient,
  );

  beforeEach(() => {
    httpClient.clear();
    discoveryService.clear();
  });

  test('should not wrap method if there is no http interface decorator', async () => {
    // given
    class SampleClient {
      @GetExchange('/api')
      async request(): Promise<string> {
        return 'request';
      }
    }
    const instance = discoveryService.addProvider(SampleClient);
    nodeFetchInjector.onModuleInit();

    // when
    const actual = await instance.request();

    // then
    expect(actual).toBe('request');
    expect(httpClient.requestInfo).toHaveLength(0);
  });

  test('should not wrap method if there is no http exchange', async () => {
    // given
    @HttpInterface()
    class SampleClient {
      async request(): Promise<string> {
        return 'request';
      }
    }
    const instance = discoveryService.addProvider(SampleClient);
    nodeFetchInjector.onModuleInit();

    // when
    const actual = await instance.request();

    // then
    expect(actual).toBe('request');
    expect(httpClient.requestInfo).toHaveLength(0);
  });

  test('should request to given url', async () => {
    // given
    @HttpInterface('https://example.com')
    class SampleClient {
      @GetExchange('/api')
      async request(): Promise<string> {
        return 'request';
      }
    }
    const instance = discoveryService.addProvider(SampleClient);
    nodeFetchInjector.onModuleInit();

    // when
    await instance.request();

    // then
    expect(httpClient.requestInfo).toHaveLength(1);
    expect(httpClient.requestInfo[0].url).toBe('https://example.com/api');
  });

  test('should request to path parm replaced url', async () => {
    // given
    @HttpInterface('https://example.com')
    class SampleClient {
      @GetExchange('/api/users/{id}/{id}')
      async request(@PathVariable('id') id: string): Promise<string> {
        return 'request';
      }
    }
    const instance = discoveryService.addProvider(SampleClient);
    nodeFetchInjector.onModuleInit();

    // when
    await instance.request('1');

    // then
    expect(httpClient.requestInfo).toHaveLength(1);
    expect(httpClient.requestInfo[0].url).toBe(
      'https://example.com/api/users/1/1',
    );
  });

  test('should request to multiple path parm replaced url', async () => {
    // given
    @HttpInterface('https://example.com')
    class SampleClient {
      @GetExchange('/api/users/{id}/{status}')
      async request(
        @PathVariable('id') id: string,
        @PathVariable('status') status: string,
      ): Promise<string> {
        return 'request';
      }
    }
    const instance = discoveryService.addProvider(SampleClient);
    nodeFetchInjector.onModuleInit();

    // when
    await instance.request('123', 'active');

    // then
    expect(httpClient.requestInfo).toHaveLength(1);
    expect(httpClient.requestInfo[0].url).toBe(
      'https://example.com/api/users/123/active',
    );
  });

  test('should append query sting to url', async () => {
    // given
    @HttpInterface()
    class SampleClient {
      @GetExchange('https://example.com/api')
      async request(@RequestParam('keyword') keyword: string): Promise<string> {
        return 'request';
      }
    }
    const instance = discoveryService.addProvider(SampleClient);
    nodeFetchInjector.onModuleInit();

    // when
    await instance.request('search');

    // then
    expect(httpClient.requestInfo).toHaveLength(1);
    expect(httpClient.requestInfo[0].url).toBe(
      'https://example.com/api?keyword=search',
    );
  });

  test('should append query sting to url when provided as json', async () => {
    // given
    @HttpInterface()
    class SampleClient {
      @GetExchange('https://example.com/api')
      async request(
        @RequestParam() params: Record<string, unknown>,
      ): Promise<string> {
        return 'request';
      }
    }
    const instance = discoveryService.addProvider(SampleClient);
    nodeFetchInjector.onModuleInit();

    // when
    await instance.request({ keyword: 'search', page: 1, isActive: true });

    // then
    expect(httpClient.requestInfo).toHaveLength(1);
    expect(httpClient.requestInfo[0].url).toBe(
      'https://example.com/api?keyword=search&page=1&isActive=true',
    );
  });

  test.each([
    ['GET', GetExchange],
    ['POST', PostExchange],
    ['PUT', PutExchange],
    ['DELETE', DeleteExchange],
    ['PATCH', PatchExchange],
    ['HEAD', HeadExchange],
    ['OPTIONS', OptionsExchange],
  ])('should make the request using %s method', async (method, decorator) => {
    // given
    @HttpInterface()
    class SampleClient {
      @decorator('https://example.com/api')
      async request(): Promise<string> {
        return 'request';
      }
    }
    const instance = discoveryService.addProvider(SampleClient);
    nodeFetchInjector.onModuleInit();

    // when
    await instance.request();

    // then
    expect(httpClient.requestInfo).toHaveLength(1);
    expect(httpClient.requestInfo[0].method).toBe(method);
  });

  test('should include body', async () => {
    // given
    @HttpInterface()
    class SampleClient {
      @PostExchange('https://example.com/api')
      async request(@RequestBody('name') name: string): Promise<string> {
        return 'request';
      }
    }
    const instance = discoveryService.addProvider(SampleClient);
    httpClient.addResponse({ status: 'ok' });
    nodeFetchInjector.onModuleInit();

    // when
    await instance.request('userName');

    // then
    expect(httpClient.requestInfo).toHaveLength(1);
    expect(await httpClient.requestInfo[0].text()).toBe('{"name":"userName"}');
    expect(httpClient.requestInfo[0].headers.get('Content-Type')).toBe(
      'application/json',
    );
  });

  test('should include body provided by json', async () => {
    // given
    @HttpInterface()
    class SampleClient {
      @PostExchange('https://example.com/api')
      async request(
        @RequestBody() body: Record<string, unknown>,
      ): Promise<string> {
        return 'request';
      }
    }
    const instance = discoveryService.addProvider(SampleClient);
    httpClient.addResponse({ status: 'ok' });
    nodeFetchInjector.onModuleInit();

    // when
    await instance.request({ name: 'userName' });

    // then
    expect(httpClient.requestInfo).toHaveLength(1);
    expect(await httpClient.requestInfo[0].text()).toBe('{"name":"userName"}');
    expect(httpClient.requestInfo[0].headers.get('Content-Type')).toBe(
      'application/json',
    );
  });

  test('should include body provided by form', async () => {
    // given
    @HttpInterface()
    class SampleClient {
      @PostExchange('https://example.com/api')
      async request(
        @RequestForm() body: Record<string, unknown>,
      ): Promise<string> {
        return 'request';
      }
    }
    const instance = discoveryService.addProvider(SampleClient);
    httpClient.addResponse({ status: 'ok' });
    nodeFetchInjector.onModuleInit();

    // when
    await instance.request({ foo: 'bar' });

    // then
    expect(httpClient.requestInfo).toHaveLength(1);
    expect(await httpClient.requestInfo[0].text()).toContain(
      `Content-Disposition: form-data; name="foo"`,
    );
    expect(httpClient.requestInfo[0].headers.get('Content-Type')).toBe(
      'application/x-www-form-urlencoded',
    );
  });

  test('should include header provided with key', async () => {
    // given
    @HttpInterface()
    class SampleClient {
      @GetExchange('https://example.com/api')
      async request(@RequestHeader('Cookie') foo: string): Promise<string> {
        return 'request';
      }
    }
    const instance = discoveryService.addProvider(SampleClient);
    httpClient.addResponse({ status: 'ok' });
    nodeFetchInjector.onModuleInit();

    // when
    await instance.request('value');

    // then
    expect(httpClient.requestInfo).toHaveLength(1);
    expect(httpClient.requestInfo[0].headers.get('Cookie')).toBe('value');
  });

  test('should include header provided without key', async () => {
    // given
    @HttpInterface()
    class SampleClient {
      @GetExchange('https://example.com/api')
      async request(
        @RequestHeader() header: { Cookie: string },
      ): Promise<string> {
        return 'request';
      }
    }
    const instance = discoveryService.addProvider(SampleClient);
    httpClient.addResponse({ status: 'ok' });
    nodeFetchInjector.onModuleInit();

    // when
    await instance.request({ Cookie: 'value' });

    // then
    expect(httpClient.requestInfo).toHaveLength(1);
    expect(httpClient.requestInfo[0].headers.get('Cookie')).toBe('value');
  });
});
