import mongoose from "mongoose";

const ConnectDB = async()=>{
    mongoose.connection.on('connected',()=>console.log("Database is connected"));
    await mongoose.connect(`${process.env.MONGODB_URL}/mern-auth`);
};

export default ConnectDB;