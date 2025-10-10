"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const author_controller_1 = require("../controllers/author.controller");
const router = express_1.default.Router();
router.post("/authors", author_controller_1.addAuthor);
router.put("/authors/:id", author_controller_1.updateAuthor);
router.get("/rankings", author_controller_1.getRankings);
exports.default = router;
