import { describe, test, expect } from "vitest";
import { RequestBodyBuilder } from "./request-body.builder";

describe("RequestBodyBuilder", () => {
  test("should build json string with explicit key", () => {
    // given
    const builder = new RequestBodyBuilder(0, "keyword");
    const args = ["search"];

    // when
    const actual = builder.build(args);

    // then
    expect(actual).toBe('{"keyword":"search"}');
  });

  test("should build json string without key", () => {
    // given
    const builder = new RequestBodyBuilder(1);
    const args = ["invalid", { foo: "bar" }];

    // when
    const actual = builder.build(args);

    // then
    expect(actual).toBe('{"foo":"bar"}');
  });
});
