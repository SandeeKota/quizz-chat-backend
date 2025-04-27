import dotenv from 'dotenv';
dotenv.config();
const config = {
    PORT: process.env.PORT || 3002,
    MONGO_URI: process.env.MONGO_URI || "",
    JWT_SECRET: process.env.JWT_SECRET || "",
    TOCKEN_EXPIR: process.env.TOCKEN_EXPIR as string || "15d" as string,
}

export default config