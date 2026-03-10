import { Schema, model } from "mongoose";

const contactSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false,
    },
    isFavourite: {
        type: Boolean,
        default: false,
    },
    contactType: {
        type: String,
        enum: ['work', 'home', 'personal'],
        default: 'personal',
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
},
{   
    timestamps: true,
    versionKey: false,
},
);

export const Contacts = model('Contact', contactSchema);
