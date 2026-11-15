import { escapeRegex } from "@/lib/utils";

describe("escapeRegex", () => {
  it("leaves plain text unchanged", () => {
    expect(escapeRegex("Leanne Graham")).toBe("Leanne Graham");
  });

  it("escapes every special character", () => {
    const special = ".*+?^${}()|[]\\";

    expect(escapeRegex(special)).toBe(
      "\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\",
    );
  });

  it("produces a pattern that matches the input literally", () => {
    const input = "Mrs. (Dennis) [Schulist]?";
    const pattern = new RegExp(`^${escapeRegex(input)}$`);

    expect(pattern.test(input)).toBe(true);
    expect(pattern.test("Mrsx (Dennis) [Schulist]")).toBe(false);
  });
});
