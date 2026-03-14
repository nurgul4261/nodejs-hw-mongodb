export const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000;
export const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;
import path from 'path';

export const USER_ROLES = {
    USER: "user",
    ADMIN: "admin",
};

export const TEMP_FOLDER = path.join(process.cwd(), "temp");
export const UPLOAD_FOLDER = path.join(process.cwd(), "uploads");

export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');