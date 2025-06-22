import { model, Schema } from "mongoose";
import { borrow } from "../interfaces/borrow.interface";



const borrorwSchema= new Schema<borrow>({
     book: {
        type:Schema.Types.ObjectId,
        ref:"Book",
        required:true
     },
      quantity: {
        type:Number,
        min:0,
        required:true
      },
      dueDate: {
        type:Date,
        required:true
      }
},
{
    timestamps:true
})

export const Borrow= model("Borrow", borrorwSchema)