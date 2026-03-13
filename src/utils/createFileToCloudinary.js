import cloudinary from 'cloudinary';
import { env } from '../utils/env.js';

export const saveFileToCloudinary = async (file) => {
    cloudinary.v2.config({
        cloud_name: env('CLOUDINARY_CLOUD_NAME'),
        api_key: env('CLOUDINARY_API_KEY'),
        api_secret: env('CLOUDINARY_API_SECRET'),
    });

    const response = await cloudinary.v2.uploader.upload(file.path);

    return response.secure_url;
};