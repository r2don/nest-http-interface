import { MetadataScanner } from '@nestjs/core';
import { firstValueFrom, Observable } from 'rxjs';
import { beforeEach, describe, test, expect } from 'vitest';
import { Configuration } from './configuration';
import { imitation } from './imitation';
import { NodeFetchInjector } from './node-fetch.injector';
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
  GraphQLExchange,
  ResponseBody,
  ObservableResponse,
} from '../decorators';
import { StubDiscoveryService } from '../fixtures/stub-discovery.service';
import { StubHttpClient } from '../fixtures/stub-http-client';
import { type HttpClientOptions } from '../types';

describe('NodeFetchInjector', () => {
  const metadataScanner = new MetadataScanner();
  const httpClient = new StubHttpClient();
  const discoveryService = new StubDiscoveryService();
  const nodeFetchInjector = new NodeFetchInjector(
    metadataScanner,
    discoveryService,
    new Configuration({ httpClient }),
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

  test('should request to path replaced url', async () => {
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

  test('should request to multiple path replaced url', async () => {
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

  test('should use http config option from decorator', async () => {
    // given
    const options: HttpClientOptions = { timeout: 12345 };
    @HttpInterface('https://example.com')
    class SampleClient {
      @GetExchange('/api', options)
      async request(): Promise<string> {
        return 'request';
      }
    }
    const instance = discoveryService.addProvider(SampleClient);
    nodeFetchInjector.onModuleInit();

    // when
    await instance.request();

    // then
    expect(httpClient.options).toHaveLength(1);
    expect(httpClient.options[0]).toBe(options);
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

  test('should response text if there is no response body decorator', async () => {
    // given
    @HttpInterface()
    class SampleClient {
      @GetExchange('https://example.com/api')
      async request(): Promise<string> {
        return 'request';
      }
    }
    const instance = discoveryService.addProvider(SampleClient);
    httpClient.addResponse({ status: 'ok' });
    nodeFetchInjector.onModuleInit();

    // when
    const result = await instance.request();

    // then
    expect(result).toBe('{"status":"ok"}');
  });

  test('should response instance provided with response body decorator', async () => {
    // given
    class ResponseTest {
      constructor(readonly value: string) {}
    }
    @HttpInterface()
    class SampleClient {
      @GetExchange('https://example.com/api')
      @ResponseBody(ResponseTest)
      async request(): Promise<ResponseTest> {
        return imitation();
      }
    }
    const instance = discoveryService.addProvider(SampleClient);
    httpClient.addResponse({ value: 'ok' });
    nodeFetchInjector.onModuleInit();

    // when
    const result = await instance.request();

    // then
    expect(result).toBeInstanceOf(ResponseTest);
    expect(result.value).toBe('ok');
  });

  test('should use default value option', async () => {
    // given
    @HttpInterface()
    class SampleClient {
      @GetExchange('https://example.com/api')
      async request(
        @RequestHeader('Cookie', { defaultValue: 'bar' }) foo?: string,
      ): Promise<string> {
        return imitation();
      }
    }
    const instance = discoveryService.addProvider(SampleClient);
    httpClient.addResponse({ status: 'ok' });
    nodeFetchInjector.onModuleInit();

    // when
    await instance.request();

    // then
    expect(httpClient.requestInfo).toHaveLength(1);
    expect(httpClient.requestInfo[0].headers.get('Cookie')).toBe('bar');
  });

  test('should use transform function', async () => {
    // given
    @HttpInterface()
    class SampleClient {
      @GetExchange('https://example.com/api')
      async request(
        @RequestHeader('Cookie', { transform: (value) => value.toUpperCase() })
        foo: string,
      ): Promise<string> {
        return imitation();
      }
    }
    const instance = discoveryService.addProvider(SampleClient);
    httpClient.addResponse({ status: 'ok' });
    nodeFetchInjector.onModuleInit();

    // when
    await instance.request('bar');

    // then
    expect(httpClient.requestInfo).toHaveLength(1);
    expect(httpClient.requestInfo[0].headers.get('Cookie')).toBe('BAR');
  });

  test('should make graphql request without variables', async () => {
    // given
    const query = /* GraphQL */ `
      query hello {
        hello
      }
    `;
    @HttpInterface('https://example.com')
    class SampleClient {
      @GraphQLExchange(query)
      async request(): Promise<string> {
        return 'request';
      }
    }

    const instance = discoveryService.addProvider(SampleClient);
    httpClient.addResponse({ status: 'ok' });
    nodeFetchInjector.onModuleInit();

    // when
    await instance.request();

    // then
    expect(httpClient.requestInfo).toHaveLength(1);
    expect(await httpClient.requestInfo[0].json()).toEqual({ query });
    expect(httpClient.requestInfo[0].headers.get('Content-Type')).toBe(
      'application/json',
    );
  });

  test('should make graphql request with variables', async () => {
    // given
    const query = /* GraphQL */ `
      query hello($name: String!) {
        hello(name: $name)
      }
    `;
    @HttpInterface('https://example.com')
    class SampleClient {
      @GraphQLExchange(query)
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
    await instance.request({ name: 'int' });

    // then
    expect(httpClient.requestInfo).toHaveLength(1);
    expect(await httpClient.requestInfo[0].json()).toEqual({
      query,
      variables: { name: 'int' },
    });
    expect(httpClient.requestInfo[0].headers.get('Content-Type')).toBe(
      'application/json',
    );
  });

  test('should use global transform options', async () => {
    // given
    const metadataScanner = new MetadataScanner();
    const httpClient = new StubHttpClient();
    const discoveryService = new StubDiscoveryService();
    const nodeFetchInjector = new NodeFetchInjector(
      metadataScanner,
      discoveryService,
      new Configuration({
        httpClient,
        transformOption: { strategy: 'excludeAll' },
      }),
    );
    class ResponseTest {
      constructor(readonly status: string) {}
    }
    @HttpInterface()
    class SampleClient {
      @GetExchange('https://example.com/api')
      @ResponseBody(ResponseTest)
      async request(): Promise<ResponseTest> {
        return imitation();
      }
    }
    const instance = discoveryService.addProvider(SampleClient);
    httpClient.addResponse({ status: 'ok' });
    nodeFetchInjector.onModuleInit();

    // when
    const response = await instance.request();

    // then
    expect(response).toBeInstanceOf(ResponseTest);
    expect(response.status).toBeUndefined();
  });

  test('should response observable text if there is no response body decorator', async () => {
    // given
    @HttpInterface()
    class SampleClient {
      @GetExchange('https://example.com/api')
      @ObservableResponse()
      request(): Observable<string> {
        return imitation();
      }
    }
    const instance = discoveryService.addProvider(SampleClient);
    httpClient.addResponse({ status: 'ok' });
    nodeFetchInjector.onModuleInit();

    // when
    const result = instance.request();

    // then
    expect(await firstValueFrom(result)).toBe('{"status":"ok"}');
  });

  test('should response observable instance provided with response body decorator', async () => {
    // given
    class ResponseTest {
      constructor(readonly value: string) {}
    }
    @HttpInterface()
    class SampleClient {
      @GetExchange('https://example.com/api')
      @ObservableResponse()
      @ResponseBody(ResponseTest)
      request(): Observable<ResponseTest> {
        return imitation();
      }
    }
    const instance = discoveryService.addProvider(SampleClient);
    httpClient.addResponse({ value: 'ok' });
    nodeFetchInjector.onModuleInit();

    // when
    const result = instance.request();

    // then
    expect(await firstValueFrom(result)).toBeInstanceOf(ResponseTest);
  });
});
