import mongoose from "mongoose";
import { DB_NAME } from "../constant";

const connectedDB = async () => {
    try {
        const mongoUrl = (process.env.MONGODB_URL || "").replace(/\/+$/, "");
        const connectedInsatance = await mongoose.connect(`${mongoUrl}/${DB_NAME}`);
        console.log(`\n MongoDB connected !! DB HOST: ${connectedInsatance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

export default connectedDB
