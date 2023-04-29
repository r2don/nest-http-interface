<p align="center">
  <a href="http://nestjs.com"><img src="https://nestjs.com/img/logo_text.svg" alt="Nest Logo" width="320" /></a>
</p>

# nest-http-interface

[![npm version](https://badge.fury.io/js/@r2don%2Fnest-http-interface.svg)](https://badge.fury.io/js/@r2don%2Fnest-http-interface)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=r2don_nest-http-interface&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=r2don_nest-http-interface)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=r2don_nest-http-interface&metric=coverage)](https://sonarcloud.io/summary/new_code?id=r2don_nest-http-interface)

This library is inspired by the HTTP interface in Spring 6 and provides a similar API for Nest.js.

## Features

- Provides a simplified and declarative way of creating HTTP services.
- Provides a concise syntax for handling query parameters, path variables, request headers, request bodies, and forms.
- Offers integration with [class-transformer](https://github.com/typestack/class-transformer) to facilitate data transformation.
- Uses promises instead of observables

## Requirements

- Node.js 18 or later (because this library uses `fetch` internally)
- Nest.js

## Installation

```bash
$ npm install @r2don/nest-http-interface
```

## Usage

First, the module we created must be imported into `AppModule.ts`:

```ts
import {Module} from '@nestjs/common';
import {HttpInterfaceModule} from '@r2don/nest-http-interface';

@Module({
  imports: [HttpInterfaceModule.register()],
})
export class AppModule {
}
```

Then, you need to create the desired HTTP service and specify several decorators:

```ts
import {HttpInterface, GetExchange, ResponseBody, imitation} from '@r2don/nest-http-interface';

@HttpInterface()
class SampleClient {
  @GetExchange('https://example.com/api') // path or full url
  @ResponseBody(ResponseTest) // response dto
  async request(): Promise<ResponseTest> {
    return imitation(); // this is a mock function to prevent the type error
  }
}
```

After adding the service to the providers in the module, you can use it and make HTTP requests when calling
the `request` method:

```ts
import {Module} from '@nestjs/common';
import {HttpInterfaceModule} from '@your-namespace/http-interface';
import {SampleClient} from './sample.client';

@Module({
  imports: [HttpInterfaceModule.register()],
  providers: [SampleClient]
})
export class AppModule {
}
```

## Decorators

- `@HttpInterface()`: Marks the class as an HTTP service.
 
- `@{HTTP Method}Exchange(path: string)`: Marks the method as an HTTP request method, with `path` being the request's path or full URL.
 
- `@ResponseBody(dto: ClassConstructor, options?: ClassTransformOptions)`: Specifies the response DTO using a class constructor and options from the `class-transformer` library.
 
- `@PathVariable(name?: string)`: Specifies the path variable, requiring the name of the variable.
 
- `@RequestParam(key?: string)`: Specifies the query string parameter, requiring the key of the parameter. If `key` is not specified, the parameter must be an object. See examples below:
    - Example with key: `request(@RequestParam('foo') query: string): string`
    - Example without key: `request(@RequestParam() query: { foo: string }): string`

- `@RequestHeader(key?: string)`: Specifies the request header, requiring the key of the header optionally.

- `@RequestBody(key?: string)`: Specifies the request body using `application/json` as the content type, requiring the key of the body optionally.

- `@RequestForm(key?: string)`: Specifies the request form using `application/x-www-form-urlencoded` as the content type, requiring the key of the body optionally.

## License

This library is licensed under the MIT license.

## Testing

To run tests, execute:

```bash
$ pnpm test
```
