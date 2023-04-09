import { describe, test, expect } from "vitest";
import { HTTP_EXCHANGE_METADATA } from "./constants";
import {
  type HttpExchangeMetadata,
  GetExchange,
  PostExchange,
  PutExchange,
  DeleteExchange,
  OptionsExchange,
  PatchExchange,
  HeadExchange,
} from "./http-exchange.decorator";

describe("HttpExchange", () => {
  test.each([
    ["GET", GetExchange],
    ["POST", PostExchange],
    ["PUT", PutExchange],
    ["DELETE", DeleteExchange],
    ["PATCH", PatchExchange],
    ["HEAD", HeadExchange],
    ["OPTIONS", OptionsExchange],
  ])("should set %s method metadata", (method, decorator) => {
    // given
    class TestService {
      @decorator("/api/v1/sample")
      async request(): Promise<string> {
        return "";
      }
    }

    // when
    const result: HttpExchangeMetadata = Reflect.getMetadata(
      HTTP_EXCHANGE_METADATA,
      TestService.prototype,
      "request"
    );

    // then
    expect(result.method).toBe(method);
    expect(result.url).toBe("/api/v1/sample");
  });
});
