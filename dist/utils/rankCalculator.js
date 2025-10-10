"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateAuthorRankings = calculateAuthorRankings;
function calculateAuthorRankings(authors) {
    if (authors.length === 0)
        return [];
    const maxFans = Math.max(...authors.map(a => a.total_fans), 1);
    const maxFaves = Math.max(...authors.map(a => a.total_faves), 1);
    const maxSkrivees = Math.max(...authors.map(a => a.total_skrivees), 1);
    const maxReads = Math.max(...authors.map(a => a.total_skrivees_read), 1);
    const weights = { fans: 0.4, faves: 0.25, skrivees: 0.15, reads: 0.1, profile: 0.1 };
    const authorsWithScores = authors.map(a => {
        const normalizedFans = a.total_fans / maxFans;
        const normalizedFaves = a.total_faves / maxFaves;
        const normalizedSkrivees = a.total_skrivees / maxSkrivees;
        const normalizedReads = a.total_skrivees_read / maxReads;
        const normalizedProfile = a.profile_completeness / 100;
        const score = (normalizedFans * weights.fans +
            normalizedFaves * weights.faves +
            normalizedSkrivees * weights.skrivees +
            normalizedReads * weights.reads +
            normalizedProfile * weights.profile) *
            100;
        return Object.assign(Object.assign({}, a), { score });
    });
    return authorsWithScores
        .sort((a, b) => b.score - a.score)
        .map((a, index) => (Object.assign(Object.assign({}, a), { rank: index + 1 })));
}
