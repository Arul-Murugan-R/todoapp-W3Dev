import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface UserDocument extends mongoose.Document{
    name:string,
    email:string,
    password:string,
    product:[{
        title:string,
        _id:any,
        status:string,
    }],
    createdAt:Date,
    updatedAt:Date,
}
const userSchema= new Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    product:[{
        title:String,
        status:String,
        },
        {timestamps:true}
    ],
},{timestamps:true})

export default mongoose.model<UserDocument>('user',userSchema)