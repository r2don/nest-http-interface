# nest-http-interface

[![npm version](https://badge.fury.io/js/@r2don%2Fnest-http-interface.svg)](https://badge.fury.io/js/@r2don%2Fnest-http-interface)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=r2don_nest-http-interface&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=r2don_nest-http-interface)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=r2don_nest-http-interface&metric=coverage)](https://sonarcloud.io/summary/new_code?id=r2don_nest-http-interface)

This library is inspired by the HTTP interface in Spring 6 and provides a similar API for Nest.js.

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

- `@HttpInterface()`

This decorator is used to mark the class as an HTTP service.

- `@{HTTP Method}Exchange(path: string)`

These decorators are used to mark the method as an HTTP request method.
`path` is the path or full URL of the request.

- `@ResponseBody(dto: ClassConstructor, options?: ClassTransformOptions)`

This decorator is used to specify the response DTO.
It requires a class constructor and options from `class-transformer` library.

- `@PathVariable(name?: string)`

This decorator is used to specify the path variable.
It requires the name of the path variable.

- `@RequestParam(key?: string)`

This decorator is used to specify the query string parameter.
It requires the key of query string parameter.
If `key` is not specified, it requires the parameter to be an object.

```ts
// with key
class TestService {
  request(@RequestParam('foo') query: string): string {
    return imitation();
  }
}

// without key
class TestService {
  request(@RequestParam() query: { foo: string }): string {
    return imitation();
  }
}
```

- `@RequestHeader(key?: string)`

This decorator is used to specify the request header.
It requires the key of request header optionally.

- `@RequestBody(key?: string)`

This decorator is used to specify the request body.
`application/json` is used as the content type.
It requires the key of request body optionally.

- `@RequestForm(key?: string)`

This decorator is used to specify the request form.
`application/x-www-form-urlencoded` is used as the content type.
It requires the key of request body optionally.

## License

This library is licensed under the MIT license.

## Testing

To run tests, execute:

```bash
$ pnpm test
```
