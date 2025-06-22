
import dotenv from "dotenv";
import mongoose from "mongoose"
import {Server} from "http"
import app from "./app"

dotenv.config(); 
console.log("DB Name:", process.env.dbName);
console.log("DB Pass:", process.env.dbPass);

let server: Server;
const PORT=4000;

async function main() {
    try {
        console.log("index.ts running");

        await mongoose.connect(`mongodb+srv://${process.env.dbName}:${process.env.dbPass}@cluster0.n0bjr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
   server=app.listen(PORT,()=>{
        console.log(`app is listening on ${PORT}`)
   })
        
    } catch (error) {
        console.log(error)
    }
}
main()