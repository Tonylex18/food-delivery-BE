import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://Tonylex18:An41285600@cluster0.8bohf.mongodb.net/food-del').then(() => console.log("DB Connected"));
}