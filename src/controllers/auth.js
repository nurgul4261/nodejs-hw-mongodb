import { registerUser } from "../services/auth.js";
import { loginUser } from "../services/auth.js";
import { logoutUser } from "../services/auth.js";
import { refreshUser } from "../services/auth.js";
import { requestResetEmail } from "../services/auth.js";
import { resetPassword } from "../services/auth.js";
import { generateGoogleAuthUrl } from "../utils/googleOAuth.js";
import { loginOrRegisterUserWithGoogle } from "../services/auth.js";

export const registerUserController = async (req, res) => {
    const userData = req.body;
    const newUser = await registerUser(userData);
    res.status(201).send({
        message: "User registered successfully",
        data: newUser,
        status: 201,
    });
};

export const loginUserController = async (req, res) => {
    const session = await loginUser(req.body);

    res.cookie("accessToken", session.refreshToken, {
        httpOnly: true,
        expires: session.refreshTokenValidUntil,
    });

    res.cookie("sessionId", session._id, {
        httpOnly: true,
        expires: session.refreshTokenValidUntil,
    });

    res.status(200).send({  
        message: "User logged in successfully and session created",
        status: 200,
        data: {
            accessToken: session.accessToken,
        }
    });
};

export const logoutUserController = async (req, res) => {
    const { sessionId } = req.cookies;
    await logoutUser(sessionId);
    res.clearCookie("accessToken");
    res.clearCookie("sessionId");
    res.status(204).send();
};

export const refreshUserController = async (req, res) => {
    const { accessToken: refreshToken, sessionId } = req.cookies;
    const session = await refreshUser(refreshToken, sessionId);

    res.cookie("accessToken", session.refreshToken, {
        httpOnly: true,
        expires: session.refreshTokenValidUntil,
    });

    res.cookie("sessionId", session._id, {
        httpOnly: true,
        expires: session.refreshTokenValidUntil,
    });

    res.status(200).send({
        message: "User refreshed successfully",
        status: 200,
        data: {
            accessToken: session.accessToken,
        }
    });
};

export const requestResetEmailController = async (req, res) => {
    const { email } = req.body;
    await requestResetEmail(email);
    res.status(200).send({
        status: 200,
        message: "Reset password email has been successfully sent.",
        data: {},
    });
};

export const resetPasswordController = async (req, res) => {
    const { password, token } = req.body;
    await resetPassword(token, password);
    res.status(200).send({
        status: 200,
        message: "Password has been successfully reset.",
        data: {},
    });
};

export const getGoogleAuthUrlController = (req, res) => {
    const url = generateGoogleAuthUrl();

    return res.status(200).send({
        message: "Google auth URL generated successfully",
        status: 200,
        data: {
            url,
        },
    });
};

export const googleAuthController = async (req, res) => {
    const { code } = req.query; 

    const session = await loginOrRegisterUserWithGoogle(code);
    res.cookie("refreshToken", session.refreshToken, {
        httpOnly: true,
        expires: session.refreshTokenValidUntil,
    });
    res.cookie("sessionId", session._id, {
        httpOnly: true,
        expires: session.refreshTokenValidUntil,
    });
    res.status(200).send({
        message: "User authenticated with Google successfully",
        status: 200,        
        data: {
            accessToken: session.accessToken,
        }
    });
}