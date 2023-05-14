import { type Options } from 'opossum';
import { CIRCUIT_BREAKER_METADATA } from './constants';
import { CircuitBreakerBuilder } from '../builders/circuit-breaker.builder';
import { type AsyncFunction } from '../types';

export const CircuitBreaker =
  (options: Options) =>
  <P extends string>(target: Record<P, AsyncFunction>, propertyKey: P) => {
    Reflect.defineMetadata(
      CIRCUIT_BREAKER_METADATA,
      new CircuitBreakerBuilder(options),
      target,
      propertyKey,
    );
  };
