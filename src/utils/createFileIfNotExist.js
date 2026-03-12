import fs from "fs/promises";

export const createFileIfNotExist = async (path) => {
    try {
        await fs.access(path);
    } catch (error) {
        console.log(`Error creating file: ${error.message}`);
        if (error.code === 'ENOENT') {
            await fs.mkdir(path);
            console.log(`File created at: ${path}`);
        }
    }
};