import dotenv from 'dotenv';

dotenv.config();

export const env = (key, defaultValue) => {
  const value = process.env[key];

  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  
  if (!value && defaultValue) {
    return defaultValue;
  }
  
  return value;
};