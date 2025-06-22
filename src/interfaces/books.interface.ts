export interface books {
    title: String,
    author: String,
    genre: "FICTION" | "NON_FICTION" | "SCIENCE"| "HISTORY"| "BIOGRAPHY" | "FANTASY",
    isbn: String,
    description: String,
    copies: Number,
    available: Boolean
}