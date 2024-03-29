<p align="center">
  <a href="https://nestjs.com"><img src="https://nestjs.com/img/logo_text.svg" alt="Nest Logo" width="320" /></a>
</p>

# nest-http-interface

[![npm version](https://badge.fury.io/js/@r2don%2Fnest-http-interface.svg)](https://badge.fury.io/js/@r2don%2Fnest-http-interface)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=r2don_nest-http-interface&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=r2don_nest-http-interface)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=r2don_nest-http-interface&metric=coverage)](https://sonarcloud.io/summary/new_code?id=r2don_nest-http-interface)

This library is inspired by the HTTP interface in Spring 6 and provides a similar API for Nest.js.

## Features

- Provides a simplified and declarative way of creating HTTP services.
- Supports both REST and GraphQL requests.
- Provides a concise syntax for handling query parameters, path variables, request headers, request bodies, and forms.
- Offers integration with [class-transformer](https://github.com/typestack/class-transformer) to facilitate data
  transformation.
- Support both promise and observable.
- Circuit breaker support

## Requirements

- Node.js 
    - 18 or later if `HttpClient` is not specified (default: `fetch`)
    - if custom `HttpClient` is provided, you can use lower version of Node.js
- Nest.js 8 or later

## Installation

```bash
$ npm install @r2don/nest-http-interface
```

If you have not installed `class-transformer`, you need to install it:

```bash
$ npm install class-transformer
```

## Usage

First, the module we created must be imported into `AppModule.ts`:

```ts
import { Module } from '@nestjs/common';
import { HttpInterfaceModule } from '@r2don/nest-http-interface';

@Module({
  imports: [HttpInterfaceModule.forRoot()],
})
export class AppModule {}
```

Then, you need to create the desired HTTP service and specify several decorators:

```ts
import {
  HttpInterface,
  GetExchange,
  ResponseBody,
  imitation,
  PathVariable,
} from '@r2don/nest-http-interface';

@HttpInterface('https://example.com/api') // base url
class UserHttpService {
  @GetExchange('/users/{id}') // path
  @ResponseBody(UserResponse) // response dto
  async request(@PathVariable('id') id: number): Promise<UserResponse> {
    return imitation(id); // this is a mock function to prevent the type error
  }
}
```

After adding the service to the providers in the module, you can use it and make HTTP requests when calling
the `request` method:

```ts
@Injectable()
class UserService {
  constructor(private readonly client: UserHttpService) {}

  async getUser(id: number): Promise<UserResponse> {
    return this.client.request(id);
  }
}
```

## Decorators

- `@HttpInterface()`: Marks the class as an HTTP service.

- `@{HTTP Method}Exchange(path: string, options?: HttpClientOptions)`: Marks the method as an HTTP request method, with `path` being the request's
  path or full URL.

- `@GraphQLExchange(query: string, url = '/graphql', options?: HttpClientOptions)`: Marks the method as a GraphQL request method, with `query` being
  the GraphQL query and `url` being the GraphQL endpoint.

- `@ResponseBody(dto: ClassConstructor, options?: ClassTransformOptions)`: Specifies the response DTO using a class
  constructor and options from the `class-transformer` library.

- `@PathVariable(name?: string)`: Specifies the path variable, requiring the name of the variable.

- `@RequestParam(key?: string, defaultValue?: string)`: Specifies the query string parameter, requiring the key of the
  parameter. If `key` is not specified, the parameter must be an object. See examples below:

  - Example with key: `request(@RequestParam('foo') query: string): string`
  - Example without key: `request(@RequestParam() query: { foo: string }): string`

- `@RequestHeader(key?: string, option?: { defaultValue?: string; transform?: (value: string) => string })`: Specifies
  the request header, requiring the key of the header optionally.

- `@Bearer()`: Specifies the bearer token using the `Authorization` header.

- `@Cookie(key: string)`: Specifies the cookie using the `Cookie` header, requiring the key of the cookie.

- `@RequestBody(key?: string, defalutValue?: unkown)`: Specifies the request body using `application/json` as the
  content type, requiring the key of the body optionally.

- `@RequestForm(key?: string, defaultValue?: string)`: Specifies the request form
  using `application/x-www-form-urlencoded` as the content type, requiring the key of the body optionally.

- `@CircuitBreaker(options?: CircuitBreaker.Options)`: Marks the method as a circuit breaker, with `options` being the
  options of the circuit breaker. You can use global options by setting the `circuitBreakerOption` property in the module.
  `options` is from [opossum](https://www.npmjs.com/package/opossum) library.

- `@ObservableResponse()`: Marks the method as an observable method. If this decorator is not specified, the method will return
  a promise.

## Auto generate `@ResponseBody()` from return type of exchange method

Because of limitation of `reflect-metadata`, `@ResponseBody()` is required to specify the response DTO.

But this library provides a way to auto generate `@ResponseBody()` and infers response DTO from return type of exchange method.

It uses `CLI Plugin` like `@nestjs/swagger` and `@nestjs/graphql`.

To enable the plugin, open nest-cli.json

```json
{
  "compilerOptions": {
    "plugins": ["@r2don/nest-http-interface"]
  }
}
```

You can use the options property to customize the behavior of the plugin.

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "@r2don/nest-http-interface",
        "options": {
          "interfaceFilenameSuffix": [".http.service.ts"]
        }
      }
    ]
  }
}
```

Here is the list of options:

| option                  | default         | description               |
| ----------------------- | --------------- | ------------------------- |
| interfaceFilenameSuffix | ['.service.ts'] | HTTP service files suffix |

`@ResponseBody()` will be added whenever `nest start` or `nest build` is executed.

## Example

There are some examples in the [example](./example) directory.
Please refer to the [README.md](./example/README.md).

## License

This library is licensed under the MIT license.

## Testing

To run tests, execute:

```bash
$ pnpm test
```
