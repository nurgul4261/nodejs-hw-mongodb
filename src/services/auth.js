import createHttpError from "http-errors";
import bcrypt from "bcrypt"; 
import UsersCollection from "../db/models/users.js";
import SessionsCollection from "../db/models/sessions.js";
import { randomBytes } from "node:crypto";
import { FIFTEEN_MINUTES_IN_MS, THIRTY_DAYS_IN_MS } from "../constants/index.js";
import sendMail from "../utils/sendMail.js";
import jwt from "jsonwebtoken";
import path from "node:path";
import fs from "node:fs/promises";
import handlebars from "handlebars";

const TEMPLATE_DIR = path.join(process.cwd(), "src", "templates");

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
        throw createHttpError(404, "User not found!");
    }

    const resetToken = jwt.sign(
        {
            sub: user._id,
            email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "5m" }
    );

    const templatePath = path.join(TEMPLATE_DIR, "reset-password-mail.html");
    const templateContent = await fs.readFile(templatePath, "utf-8");
    const template = handlebars.compile(templateContent.toString());

    const htmlContent = template({ 
        name: user.name, 
        url: `${process.env.APP_DOMAIN}/reset-password?token=${resetToken}`,
    });

    try {
        await sendMail({
            from: process.env.SMTP_FROM,
            to: user.email,
            subject: "Password Reset Request",
            html: htmlContent,
        });
    } catch (error) {
        throw createHttpError(500, "Failed to send the email, please try again later.");
    }
};

export const resetPassword = async (token, newPassword) => {
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw createHttpError(401, "Token is expired or invalid.");
    }

    const userId = decodedToken.sub;
    const userEmail = decodedToken.email;

    const user = await UsersCollection.findOne({ _id: userId, email: userEmail });
    if (!user) {
        throw createHttpError(404, "User not found!");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await UsersCollection.findByIdAndUpdate(userId, { password: hashedPassword });
    await SessionsCollection.deleteMany({ userId });
};