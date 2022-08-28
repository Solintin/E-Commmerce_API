const express = require("express");
const cors = require("cors");
const rateLimiter = require("rate-limiter");
const xss = require("xss-clean");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
require("express-async-errors"); //Replaces user defined try catch errors in controllers.
require("dotenv").config();
const app = express();
const MONGO_URI = process.env.MONGO_URI;
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
//Connect DB
const connectDB = require("./db/connect");
//Connect router
const authRoutes = require("./routes/authRoute");
const userRoutes = require("./routes/userRoute");
const productRoutes = require("./routes/productRoute");
const reviewRoutes = require("./routes/reviewRoute");
const orderRoutes = require("./routes/orderRoute");

// middlewares
const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");
const morgan = require("morgan");

app.set("proxy", 1);

app.use(morgan("tiny"));
app.use(express.json());
app.use(cors());
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 60,
    max:60
  })
);
app.use(xss());
app.use(mongoSanitize());
app.use(helmet());
app.use(cookieParser(process.env.JWT_SECRET_KEY));
app.use(express.static("./public"));
app.use(fileUpload());
// Routes
app.use("/api/v1/auth/", authRoutes);
app.use("/api/v1/users/", userRoutes);
app.use("/api/v1/products/", productRoutes);
app.use("/api/v1/reviews/", reviewRoutes);
app.use("/api/v1/orders/", orderRoutes);

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
