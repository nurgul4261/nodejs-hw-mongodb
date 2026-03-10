import { Router } from "express";
import { createUserSchema } from "../validators/users.js";
import { registerUserController } from "../controllers/auth.js";
import { validateBody } from "../middlewares/validateBody.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { loginUserController } from "../controllers/auth.js";
import { loginUserSchema } from "../validators/users.js";
import { logoutUserController } from "../controllers/auth.js";
import { refreshUserController } from "../controllers/auth.js";
import { requestResetEmailController } from "../controllers/auth.js";

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
    ctrlWrapper(requestResetEmailController)
);

export default authRouter;
