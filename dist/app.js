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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const books_model_1 = require("./models/books.model");
const borrow_model_1 = require("./models/borrow.model");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/api/books', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("post book");
    try {
        const book = new books_model_1.Book(req.body);
        yield book.save();
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book
        });
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            const formattedErrors = {};
            for (const key in error.errors) {
                const err = error.errors[key];
                formattedErrors[key] = {
                    message: err.message,
                    kind: err.kind,
                    value: err.value
                };
            }
            return res.status(400).json({
                message: "Validation failed",
                success: false,
                error: {
                    name: error.name,
                    errors: formattedErrors
                }
            });
        }
        return res.status(400).json({
            success: false,
            message: "Book creation failed",
            error: error instanceof Error ? error.message : error
        });
    }
}));
app.get('/api/books', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filter, sortBy, sort, limit } = req.query;
        const query = {};
        if (filter) {
            const numFilter = Number(filter);
            const isNumber = !isNaN(numFilter);
            query.$or = [
                { genre: { $regex: filter, $options: "i" } },
                { title: { $regex: filter, $options: "i" } },
                { author: { $regex: filter, $options: "i" } },
                { isbn: { $regex: filter, $options: "i" } },
                { description: { $regex: filter, $options: "i" } },
                ...(isNumber ? [{ copies: numFilter }] : [])
            ];
        }
        const sortOptions = {};
        sortOptions[sortBy] = sort === 'desc' ? -1 : 1;
        const books = yield books_model_1.Book.find(query)
            .sort(sortOptions)
            .limit(Number(limit));
        res.status(200).json({
            success: true,
            message: 'Books retrieved successfully',
            data: books,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch books',
            error: error instanceof Error ? error.message : error,
        });
    }
}));
app.get('/api/books/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const book = yield books_model_1.Book.findById({ _id: id });
    res.status(201).json({
        success: true,
        message: "Book created successfully",
        data: book
    });
}));
app.put('/api/books/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updateData = req.body;
    if (updateData.copies > 0) {
        updateData.available = true;
    }
    if (updateData.copies === 0) {
        updateData.available = false;
    }
    const book = yield books_model_1.Book.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    });
    res.status(201).json({
        success: true,
        message: "Book updated successfully",
        data: updateData
    });
}));
app.delete('/api/books/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const deletedBook = yield books_model_1.Book.findByIdAndDelete(id);
    if (!deletedBook) {
        res.status(404).json({
            success: false,
            message: " book not found"
        });
    }
    res.status(201).json({
        success: true,
        message: "book deleted successfully",
        data: deletedBook,
    });
}));
app.post('/api/borrow', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const borrow = new borrow_model_1.Borrow(req.body);
    console.log(req.body);
    const { book, quantity, dueDate } = req.body;
    const books = yield books_model_1.Book.findById(book);
    if (!books || typeof books.copies !== 'number') {
        return res.status(400).json({
            success: false,
            message: 'Book not found or invalid copies value'
        });
    }
    if (books.copies < quantity) {
        res.status(400).json({
            success: false,
            message: "Not enough copies avaiable"
        });
    }
    books.copies -= quantity;
    if (books.copies === 0) {
        books.available = false;
    }
    yield books.save();
    yield borrow.save();
    console.log(borrow);
    res.status(201).json({
        success: true,
        message: "Book borrowed successfully",
        data: borrow
    });
}));
app.get('/api/borrow', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const borrow = yield borrow_model_1.Borrow.aggregate([
            {
                $group: {
                    _id: "$book",
                    quantity: { $sum: "$quantity" },
                    dueDate: { $first: "$dueDate" }
                }
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookInfo"
                }
            },
            {
                $unwind: "$bookInfo"
            },
            {
                $project: {
                    _id: 0,
                    totalQuantity: "$quantity",
                    book: {
                        title: "$bookInfo.title",
                        isbn: "$bookInfo.isbn"
                    }
                }
            }
        ]);
        res.status(201).json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: borrow
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch borrowed books",
        });
    }
}));
app.get('/', (req, res) => {
    res.send('welcome to todo app');
});
exports.default = app;
