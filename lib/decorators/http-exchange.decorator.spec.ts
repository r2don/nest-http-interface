import { describe, test, expect } from "vitest";
import { HTTP_EXCHANGE_METADATA } from "./constants";
import {
  GetExchange,
  PostExchange,
  PutExchange,
  DeleteExchange,
  OptionsExchange,
  PatchExchange,
  HeadExchange,
} from "./http-exchange.decorator";
import { type HttpRequestBuilder } from "../builders/http-request.builder";

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
    const result: HttpRequestBuilder = Reflect.getMetadata(
      HTTP_EXCHANGE_METADATA,
      TestService.prototype,
      "request"
    );

    // then
    expect(result.target).toBe(TestService.prototype);
    expect(result.propertyKey).toBe("request");
    expect(result.method).toBe(method);
    expect(result.url).toBe("/api/v1/sample");
  });
});
