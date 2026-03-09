import { Schema, model } from "mongoose";

const SessionsCollection = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "Users",   
        required: true,
    },
    accessToken: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: false,
    },
    accessTokenValidUntil: {
        type: Date,
        required: false,
    },
    refreshTokenValidUntil: {
        type: Date,
        required: false,
    },
},
{   
    timestamps: true,
    versionKey: false,
},
);

const SessionsCollectionCollection = model('Sessions', SessionsCollection);

export default SessionsCollectionCollection;
