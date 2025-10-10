import express from "express";
import { addAuthor, updateAuthor, getRankings } from "../controllers/author.controller";

const router = express.Router();

router.post("/authors", addAuthor);
router.put("/authors/:id", updateAuthor);
router.get("/rankings", getRankings);

export default router;
