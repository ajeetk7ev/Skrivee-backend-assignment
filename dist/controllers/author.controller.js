"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRankings = exports.updateAuthor = exports.addAuthor = void 0;
const prisma_1 = require("../config/prisma");
const rankCalculator_1 = require("../utils/rankCalculator");
const author_schema_1 = require("../validators/author.schema");
const addAuthor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = author_schema_1.authorSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
        }
        const { name, total_fans, total_faves, total_skrivees, total_skrivees_read, profile_completeness } = parsed.data;
        yield prisma_1.prisma.author.create({
            data: { name, total_fans, total_faves, total_skrivees, total_skrivees_read, profile_completeness },
        });
        const authors = yield prisma_1.prisma.author.findMany();
        const formattedAuthors = authors.map(a => {
            var _a, _b;
            return ({
                id: a.id,
                name: a.name,
                total_fans: a.total_fans,
                total_faves: a.total_faves,
                total_skrivees: a.total_skrivees,
                total_skrivees_read: a.total_skrivees_read,
                profile_completeness: a.profile_completeness,
                score: (_a = a.score) !== null && _a !== void 0 ? _a : 0,
                rank: (_b = a.rank) !== null && _b !== void 0 ? _b : 0,
            });
        });
        const ranked = (0, rankCalculator_1.calculateAuthorRankings)(formattedAuthors);
        for (const a of ranked) {
            yield prisma_1.prisma.author.update({
                where: { id: a.id },
                data: { score: a.score, rank: a.rank },
            });
        }
        res.status(201).json({ message: "Author added and ranks updated." });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.addAuthor = addAuthor;
const updateAuthor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma_1.prisma.author.update({ where: { id }, data: req.body });
        const authors = yield prisma_1.prisma.author.findMany();
        const formattedAuthors = authors.map(a => {
            var _a, _b;
            return ({
                id: a.id,
                name: a.name,
                total_fans: a.total_fans,
                total_faves: a.total_faves,
                total_skrivees: a.total_skrivees,
                total_skrivees_read: a.total_skrivees_read,
                profile_completeness: a.profile_completeness,
                score: (_a = a.score) !== null && _a !== void 0 ? _a : 0,
                rank: (_b = a.rank) !== null && _b !== void 0 ? _b : 0
            });
        });
        const ranked = (0, rankCalculator_1.calculateAuthorRankings)(formattedAuthors);
        for (const a of ranked) {
            yield prisma_1.prisma.author.update({
                where: { id: a.id },
                data: { score: a.score, rank: a.rank },
            });
        }
        res.json({ message: "Author updated and ranks recalculated." });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.updateAuthor = updateAuthor;
const getRankings = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authors = yield prisma_1.prisma.author.findMany({ orderBy: { rank: "asc" } });
    res.json(authors);
});
exports.getRankings = getRankings;
