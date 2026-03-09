import { Schema, model } from "mongoose";
import { USER_ROLES } from "../../constants/index.js";

const usersSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },  
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: [USER_ROLES.USER, USER_ROLES.ADMIN],
        default: USER_ROLES.USER,
        required: true,
    },
},
{
    timestamps: true,
    versionKey: false,
}
);

usersSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

const UsersCollection = model('Users', usersSchema);

export default UsersCollection;