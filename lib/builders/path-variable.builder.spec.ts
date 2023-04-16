import { describe, test, expect } from "vitest";
import { PathVariableBuilder } from "./path-variable.builder";

describe("PathVariableBuilder", () => {
  test("should replace url with given variable", () => {
    // given
    const builder = new PathVariableBuilder(0, "id");
    const args = [123];

    // when
    const actual = builder.build("/user/{id}", args);

    // then
    expect(actual).toBe("/user/123");
  });

  test("should replace multiple variables in url", () => {
    // given
    const builder = new PathVariableBuilder(0, "id");
    builder.add(1, "name");
    const url = "/user/{id}/profile/{name}";
    const args = [123, "john"];

    // when
    const actual = builder.build(url, args);

    // then
    expect(actual).toBe("/user/123/profile/john");
  });

  test("should handle url without variables", () => {
    // given
    const builder = new PathVariableBuilder(0, "id");
    const args = [123];

    // when
    const actual = builder.build("/user/profile", args);

    // then
    expect(actual).toBe("/user/profile");
  });

  test("should handle variables not replaced in url", () => {
    // given
    const builder = new PathVariableBuilder(0, "id");
    const args = [123];

    // when
    const actual = builder.build("/user/{id}/profile/{name}", args);

    // then
    expect(actual).toBe("/user/123/profile/{name}");
  });

  test("should replace multiple variables with same name", () => {
    // given
    const builder = new PathVariableBuilder(0, "id");
    const args = [123];

    // when
    const actual = builder.build("/user/{id}/profile/{id}", args);

    // then
    expect(actual).toBe("/user/123/profile/123");
  });
});
