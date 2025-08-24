import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
    name: string;   
    email: string;
    password: string;
    role: string;
    playlist: string[];

}

const userSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true , default: "user"},  
    playlist: [{
        type:String,
        required:true
    }]
},{timestamps:true});

export const User =  mongoose.model<IUser>("User", userSchema);
