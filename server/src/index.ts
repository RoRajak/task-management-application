import connectedDB from "./DB/config";
import { app } from "./app";
import dotenv from 'dotenv'

dotenv.config({
    path:'.env'
})

connectedDB()
.then(()=>{
    app.listen(process.env.PORT ||8000,()=>{
        console.log(`⚙️  Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MONGO db connection failed !!! ", err);
})
