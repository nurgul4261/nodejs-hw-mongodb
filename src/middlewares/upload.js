import multer from "multer";
import { TEMP_FOLDER } from "../constants/index.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, TEMP_FOLDER);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = file.originalname.split('.').pop();
        cb(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
    }   
});

export const upload = multer({ storage });