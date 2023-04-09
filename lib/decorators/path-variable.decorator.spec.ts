import { describe, test, expect } from "vitest";
import { PATH_VARIABLE_METADATA } from "./constants";
import {
  PathVariable,
  type PathVariableMetadata,
} from "./path-variable.decorator";

describe("PathVariable", () => {
  test("should set path variable metadata", () => {
    // given
    class TestService {
      request(
        @PathVariable("foo") foo: string,
        @PathVariable("bar") bar: string
      ): string {
        return foo + bar;
      }
    }

    // when
    const result: PathVariableMetadata = Reflect.getMetadata(
      PATH_VARIABLE_METADATA,
      TestService.prototype,
      "request"
    );

    // then
    expect(result).toHaveLength(2);
    expect(result.get(0)).toBe("foo");
    expect(result.get(1)).toBe("bar");
  });
});
