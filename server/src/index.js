import app from './app.js';
import connectDB from './db/index.js';



const PORT = process.env.PORT || 3000;

connectDB().then(
  () => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    } );
  }
).catch((err => {
  console.log("Error in mongodb connection : ", err.message);
}));
