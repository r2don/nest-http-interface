import { describe, test, expect } from "vitest";
import { HTTP_INTERFACE_METADATA } from "./constants";
import { HttpInterface } from "./http-interface.decorator";

describe("HttpInterface", () => {
  test("should set default url metadata", () => {
    // given
    @HttpInterface()
    class TestService {}

    // when
    const result = Reflect.getMetadata(HTTP_INTERFACE_METADATA, TestService);

    // then
    expect(result).toBe("");
  });

  test("should set provided url metadata", () => {
    // given
    @HttpInterface("/api/v1/sample")
    class TestService {}

    // when
    const result = Reflect.getMetadata(HTTP_INTERFACE_METADATA, TestService);

    // then
    expect(result).toBe("/api/v1/sample");
  });
});
