const { init } = require("./index");

describe("generateVanityNumbers function", () => {
  it("should generate vanity numbers for a valid phone number", async () => {
    const phoneNumber = "1-800-224-5489";
    const expectedVanityNumbers = [
      "1-800-ABILITY",
      "1-800-AAGJGTW",
      "1-800-AAGJGTX",
      "1-800-AAGJGTY",
      "1-800-AAGJGTZ",
    ];
    const result = await init(phoneNumber);
    expect(result).toEqual(expectedVanityNumbers);
  });

  it("should return an empty array for an empty input", async () => {
    const result = await init("");
    expect(result).toEqual([]);
  });

  it("should handle special characters in the input", async () => {
    const phoneNumber = "1@%-800-224-5489";
    const expectedVanityNumbers = [
      "1-800-ABILITY",
      "1-800-AAGJGTW",
      "1-800-AAGJGTX",
      "1-800-AAGJGTY",
      "1-800-AAGJGTZ",
    ];
    const result = await init(phoneNumber);
    expect(result).toEqual(expectedVanityNumbers);
  });
});
