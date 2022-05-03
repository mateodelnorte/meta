import index from "../src/index.js";

jest.spyOn(process, "exit").mockImplementation(() => {});

describe("index.js", () => {
  it("should exist", () => {
    expect(index).toBeDefined();
  });
});
