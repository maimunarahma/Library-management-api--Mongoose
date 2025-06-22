"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = require("mongoose");
const bookSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    author: {
        type: String,
        required: [true, 'Author is required']
    },
    genre: {
        type: String,
        enum: ["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"],
        message: 'Genre must be one of FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, or FANTASY'
    },
    isbn: {
        type: String,
        unique: true,
        required: [true, 'ISBN is required']
    },
    description: {
        type: String,
    },
    copies: {
        type: Number,
        min: [0, "Copies must be a positive number"]
    },
    available: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
});
exports.Book = (0, mongoose_1.model)("Book", bookSchema);
