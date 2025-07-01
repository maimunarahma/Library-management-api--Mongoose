"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Borrow = void 0;
const mongoose_1 = require("mongoose");
const borrorwSchema = new mongoose_1.Schema({
    book: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Book",
        required: true
    },
    quantity: {
        type: Number,
        min: 0,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});
exports.Borrow = (0, mongoose_1.model)("Borrow", borrorwSchema);
