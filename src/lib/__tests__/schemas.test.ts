import { newPostSchema } from "@/lib/schemas";

function errorsFor(input: unknown) {
  const result = newPostSchema.safeParse(input);
  return result.success
    ? {}
    : Object.fromEntries(
        result.error.issues.map((issue) => [issue.path[0], issue.message]),
      );
}

describe("newPostSchema", () => {
  it("accepts a title and body and trims them", () => {
    expect(
      newPostSchema.parse({ title: "  Hello  ", body: "\n World \n" }),
    ).toEqual({ title: "Hello", body: "World" });
  });

  it("requires both fields", () => {
    expect(errorsFor({ title: "", body: "" })).toEqual({
      title: "Title is required",
      body: "Body is required",
    });
  });

  it("treats whitespace-only values as empty", () => {
    expect(errorsFor({ title: "   ", body: "\t\n" })).toEqual({
      title: "Title is required",
      body: "Body is required",
    });
  });

  it("limits the title to 120 characters after trimming", () => {
    expect(errorsFor({ title: "a".repeat(120), body: "ok" })).toEqual({});
    expect(errorsFor({ title: ` ${"a".repeat(120)} `, body: "ok" })).toEqual(
      {},
    );
    expect(errorsFor({ title: "a".repeat(121), body: "ok" })).toEqual({
      title: "Title must be 120 characters or fewer",
    });
  });
});
