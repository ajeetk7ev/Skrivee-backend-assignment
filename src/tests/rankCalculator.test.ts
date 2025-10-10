import { calculateAuthorRankings, Author } from "../utils/rankCalculator";

describe("calculateAuthorRankings", () => {
  test("returns an empty array when given no authors", () => {
    const result = calculateAuthorRankings([]);
    expect(result).toEqual([]);
  });

  test("calculates scores and assigns ranks correctly for multiple authors", () => {
    const authors: Author[] = [
      {
        id: "1",
        name: "Ajeet Kumar",
        total_fans: 120,
        total_faves: 95,
        total_skrivees: 15,
        total_skrivees_read: 220,
        profile_completeness: 95,
      },
      {
        id: "2",
        name: "Priya Sharma",
        total_fans: 200,
        total_faves: 180,
        total_skrivees: 25,
        total_skrivees_read: 350,
        profile_completeness: 98,
      },
      {
        id: "3",
        name: "Rohit Verma",
        total_fans: 75,
        total_faves: 60,
        total_skrivees: 10,
        total_skrivees_read: 140,
        profile_completeness: 85,
      },
      {
        id: "4",
        name: "Sneha Patel",
        total_fans: 310,
        total_faves: 290,
        total_skrivees: 40,
        total_skrivees_read: 520,
        profile_completeness: 99,
      },
      {
        id: "5",
        name: "Vikram Singh",
        total_fans: 150,
        total_faves: 130,
        total_skrivees: 18,
        total_skrivees_read: 260,
        profile_completeness: 92,
      },
    ];

    const result = calculateAuthorRankings(authors);

    // Each author should have score + rank
    result.forEach(a => {
      expect(a.score).toBeDefined();
      expect(a.rank).toBeDefined();
      expect(typeof a.score).toBe("number");
      expect(typeof a.rank).toBe("number");
    });

    // Check that ranks are sequential starting from 1
    const ranks = result.map(a => a.rank);
    expect(ranks).toEqual([1, 2, 3, 4, 5]);

    // Check descending order of scores
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].score!).toBeGreaterThanOrEqual(result[i + 1].score!);
    }

    // Top-ranked author should be Sneha Patel (based on data)
    expect(result[0].name).toBe("Sneha Patel");
  });

  test("handles equal scores consistently", () => {
    const authors: Author[] = [
      {
        id: "1",
        name: "Author A",
        total_fans: 100,
        total_faves: 100,
        total_skrivees: 10,
        total_skrivees_read: 100,
        profile_completeness: 90,
      },
      {
        id: "2",
        name: "Author B",
        total_fans: 100,
        total_faves: 100,
        total_skrivees: 10,
        total_skrivees_read: 100,
        profile_completeness: 90,
      },
    ];

    const result = calculateAuthorRankings(authors);
    expect(result[0].score).toBe(result[1].score);
    expect(new Set(result.map(a => a.rank)).size).toBe(2); // unique ranks 1 and 2
  });

  test("normalizes values properly (no NaN or Infinity)", () => {
    const authors: Author[] = [
      {
        id: "1",
        name: "Zero Author",
        total_fans: 0,
        total_faves: 0,
        total_skrivees: 0,
        total_skrivees_read: 0,
        profile_completeness: 0,
      },
      {
        id: "2",
        name: "Non-Zero Author",
        total_fans: 100,
        total_faves: 50,
        total_skrivees: 20,
        total_skrivees_read: 200,
        profile_completeness: 100,
      },
    ];

    const result = calculateAuthorRankings(authors);

    result.forEach(a => {
      expect(a.score).not.toBeNaN();
      expect(a.score).not.toBe(Infinity);
    });
  });
});
