

import express, { Application, Express, Request, Response} from 'express';
import { Book } from './models/books.model';
import { Borrow } from './models/borrow.model';
const app: Application = express()

app.use(express.json());



app.post('/books',  async (req: Request, res: Response)  => {
    console.log("post book")
    try {
        const book = new Book(req.body);
        await book.save();
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book
        });
    }
    catch (error: any) {


        if (error.name === 'ValidationError') {
            const formattedErrors: Record<string, any> = {};
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
})
app.get('/books',  async (req: Request, res: Response)  => {
    try {
        const { filter, sortBy = 'createdAt', sort = 'desc', limit = '10' } = req.query;

        const query: any = {};
        if (filter) {
            query.genre = filter;
        }

        const sortOptions: any = {};
        sortOptions[sortBy as string] = sort === 'desc' ? -1 : 1;

        const books = await Book.find(query)
            .sort(sortOptions)
            .limit(Number(limit));

        res.status(200).json({
            success: true,
            message: 'Books retrieved successfully',
            data: books,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch books',
            error: error instanceof Error ? error.message : error,
        });
    }
});


app.get('/books/:id',  async (req: Request, res: Response)  => {
    const id = req.params.id;
    const book = await Book.findById({ _id: id })
    res.status(201).json({
        success: true,
        message: "Book created successfully",
        data: book
    });

})
app.put('/books/:id',  async (req: Request, res: Response)  => {
    const id = req.params.id;
    const updateData = req.body;

    const book = await Book.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    })
    res.status(201).json({
        success: true,
        message: "Book updated successfully",
        data: book
    });
})

app.delete('/books/:id',  async (req: Request, res: Response)  => {
    const id = req.params.id;
    const deletedBook = await Book.findByIdAndDelete(id)
    if (!deletedBook) {
        res.status(404).json({
            success: false,
            message: " book not found"
        })
    }
    res.status(201).json({
        success: true,
        message: "book deleted successfully",
        data: deletedBook,
    })
})

app.post('/borrow',  async (req: Request, res: Response) => {
    const borrow = new Borrow(req.body)
    const { book, quantity, dueDate } = req.body;
    const books = await Book.findById(book)
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
        })
    }
    books.copies -= quantity;
    if (books.copies === 0) {
        books.available = false;
    }
    await books.save();
    await borrow.save();

    console.log(borrow)
    res.status(201).json({
        success: true,
        message: "Book borrowed successfully",
        data: borrow
    })
})
app.get('/borrow',  async (req: Request, res: Response)  => {
    try {
        const borrow = await Borrow.aggregate([
            {
                $lookup: {
                    from: "books",
                    localField: "book",
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

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch borrowed books",

        });
    }
});

app.get('/', (req, res) => {
    res.send('welcome to todo app')
})
export default app;