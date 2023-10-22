# Example

This is an example Nest.js project for this library.

## Description

This server contains two modules:

- [server](./src/server): contains REST API for serving content.
- [client](./src/client): contains REST API for calling the server API.

`client` is calling `server` by using our HTTP interface library.

You can find HTTP interface files whose name ends with `.http.service.ts` in [client](./src/client) module.
