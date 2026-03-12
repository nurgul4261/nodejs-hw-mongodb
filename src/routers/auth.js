import { Router } from "express";
import { createUserSchema, loginUserSchema, requestResetEmailSchema, resetPasswordSchema } from "../validators/users.js";
import { registerUserController, loginUserController, logoutUserController, refreshUserController, requestResetEmailController, resetPasswordController } from "../controllers/auth.js";
import { validateBody } from "../middlewares/validateBody.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const authRouter = Router();

authRouter.post(
    "/register",
    validateBody(createUserSchema),
    ctrlWrapper(registerUserController)
);

authRouter.post(
    "/login",
    validateBody(loginUserSchema),
    ctrlWrapper(loginUserController)
);

authRouter.post(
    "/logout",
    ctrlWrapper(logoutUserController)
);

authRouter.post(
    "/refresh",
    ctrlWrapper(refreshUserController)
);

authRouter.post(
    "/request-reset-email",
    validateBody(requestResetEmailSchema),
    ctrlWrapper(requestResetEmailController)
);

authRouter.post(
    "/reset-pwd",
    validateBody(resetPasswordSchema),
    ctrlWrapper(resetPasswordController)
);

export default authRouter;