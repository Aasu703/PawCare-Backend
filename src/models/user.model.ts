import mongoose, {Document, Schema} from "mongoose";
import { UserType } from "../types/user.type";

const UserSchema: Schema = new Schema<UserType>(
    {
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        Firstname: {type: String, required: true},
        Lastname: {type: String, required: true},
        phone: {type: String},
        role: {type: String, enum: ["user", "admin", "provider"], default: "user"},
    },
    {
        timestamps: true,
    }
    
);

export interface IUser extends UserType, Document { //extends Document to include mongoose document properties
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;

}

export const UserModel = mongoose.model<IUser>("User", UserSchema);
// UserModel will be used to interact with the users collection in MongoDB
// It provides methods to create, read, update, and delete user documents

