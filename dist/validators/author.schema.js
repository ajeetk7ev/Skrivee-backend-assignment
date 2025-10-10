"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorSchema = void 0;
const zod_1 = require("zod");
exports.authorSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters long"),
    total_fans: zod_1.z.number().int().min(0, "Fans cannot be negative"),
    total_faves: zod_1.z.number().int().min(0, "Faves cannot be negative"),
    total_skrivees: zod_1.z.number().int().min(0, "Skrivees cannot be negative"),
    total_skrivees_read: zod_1.z.number().int().min(0, "Reads cannot be negative"),
    profile_completeness: zod_1.z.number().min(0).max(100, "Profile completeness must be between 0 and 100")
});
