import createHttpError from "http-errors";
import bcrypt from "bcrypt"; 
import UsersCollection from "../db/models/users.js";
import SessionsCollection from "../db/models/sessions.js";
import { randomBytes } from "node:crypto";
import { FIFTEEN_MINUTES_IN_MS, THIRTY_DAYS_IN_MS } from "../constants/index.js";

export const registerUser = async (userData) => {
    const { email, password } = userData;

    const user = await UsersCollection.findOne({ email });
    if (user) {
        throw createHttpError(409, "User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await UsersCollection.create({ ...userData, password: hashedPassword });
};

export const loginUser = async (userData) => {
    const { email, password } = userData;

    const user = await UsersCollection.findOne({ email });
    if (!user) {
        throw createHttpError(401, "Unauthorized");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw createHttpError(401, "Invalid password");
    }

    await SessionsCollection.deleteMany({ userId: user._id });

    const accessToken = randomBytes(30).toString("base64");
    const refreshToken = randomBytes(30).toString("base64");
    const accessTokenValidUntil = new Date(Date.now() + FIFTEEN_MINUTES_IN_MS);
    const refreshTokenValidUntil = new Date(Date.now() + THIRTY_DAYS_IN_MS);

    const session = await SessionsCollection.create({
        userId: user._id,
        accessToken,
        refreshToken,
        accessTokenValidUntil,
        refreshTokenValidUntil,
    });


    return session;
};

export const logoutUser = async (sessionId) => {
    await SessionsCollection.findByIdAndDelete(sessionId);
};

export const refreshUser = async (refreshToken, sessionId) => {
    const session = await SessionsCollection.findById(sessionId);

    if (!session) {
        throw createHttpError(404, "Session not found");
    }
    if (session.refreshTokenValidUntil < new Date()) {
        throw createHttpError(401, "Refresh token expired");
    }
    if (session.refreshToken !== refreshToken) {
        throw createHttpError(401, "Refresh token is invalid");
    }

    const accessTokenNew = randomBytes(30).toString("base64");
    const refreshTokenNew = randomBytes(30).toString("base64");
    const accessTokenValidUntilNew = new Date(Date.now() + FIFTEEN_MINUTES_IN_MS);
    const refreshTokenValidUntilNew = new Date(Date.now() + THIRTY_DAYS_IN_MS);

    const sessionNew = await SessionsCollection.create({
        userId: session.userId,
        accessToken: accessTokenNew,
        refreshToken: refreshTokenNew,
        accessTokenValidUntil: accessTokenValidUntilNew,
        refreshTokenValidUntil: refreshTokenValidUntilNew,
    });
    
    await SessionsCollection.findByIdAndDelete(sessionId);
    
    return sessionNew;
};

export const requestResetEmail = async (email) => {
    const user = await UsersCollection.findOne({ email });
    if (!user) {
        throw createHttpError(404, "User not found");
    }
    const resetToken = randomBytes(30).toString("base64");
    const resetTokenValidUntil = new Date(Date.now() + FIFTEEN_MINUTES_IN_MS);
    user.resetToken = resetToken;
    user.resetTokenValidUntil = resetTokenValidUntil;
    await user.save();
    return resetToken;
};
