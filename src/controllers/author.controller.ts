import type { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { calculateAuthorRankings } from "../utils/rankCalculator";
import { authorSchema, paginationSchema } from "../validators/author.schema";

export const addAuthor = async (req: Request, res: Response) => {
  try {
    const parsed = authorSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    }

    const { name, total_fans, total_faves, total_skrivees, total_skrivees_read, profile_completeness } = parsed.data;

    await prisma.author.create({
      data: { name, total_fans, total_faves, total_skrivees, total_skrivees_read, profile_completeness },
    });

    const authors = await prisma.author.findMany();
    const formattedAuthors = authors.map(a => ({
      id: a.id,
      name: a.name,
      total_fans: a.total_fans,
      total_faves: a.total_faves,
      total_skrivees: a.total_skrivees,
      total_skrivees_read: a.total_skrivees_read,
      profile_completeness: a.profile_completeness,
      score: a.score ?? 0,
      rank: a.rank ?? 0,
    }));

    const ranked = calculateAuthorRankings(formattedAuthors);

    for (const a of ranked) {
      await prisma.author.update({
        where: { id: a.id },
        data: { score: a.score, rank: a.rank },
      });
    }

    res.status(201).json({ message: "Author added and ranks updated." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateAuthor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if(!id){
      return res.status(400).json({message:"Author id is required."})
    }

    const parsed = authorSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    }

    await prisma.author.update({ where: { id }, data: req.body });

    const authors = await prisma.author.findMany();

    const formattedAuthors = authors.map(a => ({
      id: a.id,
      name: a.name,
      total_fans: a.total_fans,
      total_faves: a.total_faves,
      total_skrivees: a.total_skrivees,
      total_skrivees_read: a.total_skrivees_read,
      profile_completeness: a.profile_completeness,
      score: a.score ?? 0,
      rank: a.rank ?? 0
    }));

    const ranked = calculateAuthorRankings(formattedAuthors);

    for (const a of ranked) {
      await prisma.author.update({
        where: { id: a.id },
        data: { score: a.score, rank: a.rank },
      });
    }

    res.json({ message: "Author updated and ranks recalculated." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getRankings = async (req: Request, res: Response) => {
  try {
    // Validate pagination parameters
    const parsed = paginationSchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    }

    const { page, limit } = parsed.data;
    const skip = (page - 1) * limit;

    // Get total count for pagination metadata
    const totalCount = await prisma.author.count();

    // Get paginated authors ordered by rank
    const authors = await prisma.author.findMany({
      orderBy: { rank: "asc" },
      skip,
      take: limit,
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      data: authors,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
