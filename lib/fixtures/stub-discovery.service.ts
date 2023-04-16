import {
  type DiscoveryOptions,
  DiscoveryService,
  ModulesContainer,
} from '@nestjs/core';
import { type InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { type Module } from '@nestjs/core/injector/module';

export class StubDiscoveryService extends DiscoveryService {
  #providers: InstanceWrapper[] = [];

  constructor() {
    super(new ModulesContainer());
  }

  addProvider<T>(Provide: new (...args: unknown[]) => T): T {
    const instance = new Provide();
    const instanceWrapper = {
      instance,
      metatype: { prototype: Provide.prototype },
    };
    this.#providers.push(instanceWrapper as any);

    return instance;
  }

  clear(): void {
    this.#providers = [];
  }

  override getProviders(
    options?: DiscoveryOptions,
    modules?: Module[],
  ): InstanceWrapper[] {
    return this.#providers;
  }
}
