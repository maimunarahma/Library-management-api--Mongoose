import { model, Schema } from "mongoose";
import { books } from "../interfaces/books.interface";



const bookSchema = new Schema<books>({
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

},
    {
        timestamps: true
    })

export const Book = model("Book", bookSchema)