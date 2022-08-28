const express = require("express");
const cors = require("cors");
require("express-async-errors"); //Replaces user defined try catch errors in controllers.
require("dotenv").config();
const app = express();
const MONGO_URI = process.env.MONGO_URI;
const cookieParser = require("cookie-parser");
const fileUpload  = require("express-fileupload") 
//Connect DB
const connectDB = require("./db/connect");
//Connect router
const authRoutes = require("./routes/authRoute");
const userRoutes = require("./routes/userRoute");
const productRoutes = require("./routes/productRoute");
const reviewRoutes = require("./routes/reviewRoute");

// middlewares
const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");
const morgan = require("morgan");

app.use(morgan("tiny"));
app.use(express.json());
app.use(cors());
app.use(cookieParser(process.env.JWT_SECRET_KEY));
app.use(express.static('./public'));
app.use(fileUpload());
// Routes
app.use("/api/v1/auth/", authRoutes);
app.use("/api/v1/users/", userRoutes);
app.use("/api/v1/products/", productRoutes);
app.use("/api/v1/reviews/", reviewRoutes);

app.get("/", (req, res) => {
  res.send("Hello");
  console.log(req.signedCookies);
});
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(MONGO_URI);
    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
