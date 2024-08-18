const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const expenseRoutes = require('./routes/expense');
const userRouter = require("./routes/user");
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

//Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB connection failure", error.message);
  }
};

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use('/expenses', expenseRoutes);
app.use("/", userRouter);

app.listen(port, () => {
  connectDB();
  console.log("server is running on " + port);
});
