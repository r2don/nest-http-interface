import { type ClassTransformOptions } from 'class-transformer';
import type CircuitBreaker from 'opossum';
import { describe, expect, test } from 'vitest';
import { Configuration } from './configuration';
import { StubHttpClient } from '../fixtures/stub-http-client';

describe('Configuration', () => {
  describe('default values', () => {
    const configuration = new Configuration();

    test('timeout', () => {
      // when
      const timeout = configuration.timeout;

      // then
      expect(timeout).toBe(Configuration.DEFAULT_TIMEOUT);
    });

    test('http client', () => {
      // given
      const configuration = new Configuration();

      // when
      const httpClient = configuration.httpClient;

      // then
      expect(httpClient).toBeInstanceOf(Configuration.DEFAULT_HTTP_CLIENT);
    });

    test('transform option', () => {
      // when
      const transformOption = configuration.transformOption;

      // then
      expect(transformOption).toBeUndefined();
    });

    test('circuit breaker option', () => {
      // when
      const circuitBreakerOption = configuration.circuitBreakerOption;

      // then
      expect(circuitBreakerOption).toBeUndefined();
    });
  });

  describe('custom values', () => {
    test('timeout', () => {
      // given
      const timeout = 1000;

      // when
      const configuration = new Configuration({ timeout });

      // then
      expect(configuration.timeout).toBe(timeout);
    });

    test('http client', () => {
      // given
      const httpClient = new StubHttpClient();

      // when
      const configuration = new Configuration({ httpClient });

      // then
      expect(configuration.httpClient).toBe(httpClient);
    });

    test('transform option', () => {
      // given
      const transformOption: ClassTransformOptions = {
        enableImplicitConversion: true,
      };

      // when
      const configuration = new Configuration({ transformOption });

      // then
      expect(configuration.transformOption).toBe(transformOption);
    });

    test('circuit breaker option', () => {
      // given
      const circuitBreakerOption: CircuitBreaker.Options = {
        errorThresholdPercentage: 50,
        resetTimeout: 1000,
      };
      const timeout = 10000;

      // when
      const configuration = new Configuration({
        circuitBreakerOption,
        timeout,
      });

      // then
      expect(configuration.circuitBreakerOption).toMatchInlineSnapshot(`
        {
          "errorThresholdPercentage": 50,
          "resetTimeout": 1000,
          "timeout": 10000,
        }
      `);
    });
  });
});
