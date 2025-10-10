import { paginationSchema } from "../validators/author.schema";

describe("Pagination Schema", () => {
  test("validates default pagination parameters", () => {
    const result = paginationSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(10);
    }
  });

  test("validates custom pagination parameters", () => {
    const result = paginationSchema.safeParse({
      page: "2",
      limit: "5"
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(2);
      expect(result.data.limit).toBe(5);
    }
  });

  test("handles invalid page numbers", () => {
    const result = paginationSchema.safeParse({
      page: "0"
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1); // Should default to 1
    }
  });

  test("handles negative page numbers", () => {
    const result = paginationSchema.safeParse({
      page: "-5"
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1); // Should default to 1
    }
  });

  test("handles large limit values", () => {
    const result = paginationSchema.safeParse({
      limit: "500"
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.limit).toBe(100); // Should cap at 100
    }
  });

  test("handles zero limit", () => {
    const result = paginationSchema.safeParse({
      limit: "0"
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.limit).toBe(1); // Should default to 1
    }
  });

  test("handles non-numeric values", () => {
    const result = paginationSchema.safeParse({
      page: "abc",
      limit: "xyz"
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1); // Should default to 1
      expect(result.data.limit).toBe(10); // Should default to 10
    }
  });
});
