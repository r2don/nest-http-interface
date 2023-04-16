import { describe, test, expect } from "vitest";
import { PayloadBuilder } from "./payload-builder";

describe("PayloadBuilder", () => {
  test("should return undefined when no metadata is provided", () => {
    // given
    const args = ["arg"];
    const urlBuilder = new PayloadBuilder(args);

    // when
    const actual = urlBuilder.build();

    // then
    expect(actual).toBeUndefined();
  });
});
