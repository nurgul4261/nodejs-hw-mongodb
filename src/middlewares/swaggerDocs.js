import path from "path";
import createHttpError from "http-errors";
import swaggerUi from "swagger-ui-express";
import fs from "node:fs";

export const SWAGGER_PATH = path.join(process.cwd(), "docs", "swagger.json");

export const swaggerDocs = () => {
    try {
        const swaggerDoc = JSON.parse(fs.readFileSync(SWAGGER_PATH.toString()));
        return [...swaggerUi.serve, swaggerUi.setup(swaggerDoc)];
    } catch (error) {
        console.error("Error loading Swagger documentation:", error);
        return (req, res, next) => {
            next(createHttpError(500, "Failed to load API documentation"));
        };
    }
};