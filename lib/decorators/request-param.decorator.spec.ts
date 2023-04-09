import { describe, test, expect } from "vitest";
import { REQUEST_PARAM_METADATA } from "./constants";
import {
  RequestParam,
  type RequestParamMetadata,
} from "./request-param.decorator";

describe("RequestParam", () => {
  test("should set request param metadata with empty key", () => {
    // given
    class TestService {
      request(@RequestParam() query: { foo: string }): string {
        return query.foo;
      }
    }

    // when
    const result: RequestParamMetadata = Reflect.getMetadata(
      REQUEST_PARAM_METADATA,
      TestService.prototype,
      "request"
    );

    // then
    expect(result).toHaveLength(1);
    expect(result.get(0)).toBeUndefined();
  });

  test("should set request param metadata with key", () => {
    // given
    class TestService {
      request(@RequestParam("foo") bar: string): string {
        return bar;
      }
    }

    // when
    const result: RequestParamMetadata = Reflect.getMetadata(
      REQUEST_PARAM_METADATA,
      TestService.prototype,
      "request"
    );

    // then
    expect(result).toHaveLength(1);
    expect(result.get(0)).toBe("foo");
  });
});
