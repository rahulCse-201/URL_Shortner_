import dotenv from "dotenv";
dotenv.config();



import mongoose from "mongoose";


const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_DB_NAME}`, 
        //     {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true
        // }
    );
        console.log(`MongoDB connected : ${connectionInstance.connection.host}`);
    }catch(error){
        console.log("Error in mongodb connection : ", error.message);
    }
} 

export default connectDB;