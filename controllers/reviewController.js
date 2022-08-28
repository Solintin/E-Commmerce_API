const Review = require("../model/Review");
const User = require("../model/User");
const Product = require("../model/Products");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");
const checkPermission = require("../Utils/checkPermission");

const createReview = async (req, res) => {
  const { product: ProductId } = req.body;

  const isProductExist = await Product.findOne({ _id: ProductId });

  if (!isProductExist) {
    throw new CustomError.BadRequestError("Product not found");
  }

  const isReviewSubmitted = await Review.findOne({
    product: ProductId,
    user: req.user.userId,
  });

  if (isReviewSubmitted) {
    throw new CustomError.BadRequestError(
      "Review already submitted for this product"
    );
  }
  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res
    .status(StatusCodes.CREATED)
    .json({ message: "Review created successfully ", review });
};
const getSingleReview = async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id });

  if (!review) {
    throw new CustomError.BadRequestError("Review not found");
  }

  res.status(StatusCodes.OK).json({
    message: "Review retrieved successfully ",
    review,
  });
};
const getAllReview = async (req, res) => {
  const Reviews = await Review.find({})
    .populate({
      path: "product",
      select: "name price company",
    })
    .populate({
      path: "user",
      select: "name",
    });

  res.status(StatusCodes.OK).json({
    message: "Review retrieved successfully ",
    Reviews,
    Count: Reviews.length,
  });
};
const updateReview = async (req, res) => {
  const { rating, title, comment } = req.body;
  const review = await Review.findOne({ _id: req.params.id });
  if (!review) {
    throw new CustomError.NotFoundError("Review not found");
  }
  const user = await User.findById(req.user.userId);

  checkPermission(user, review.user);
  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();

  res.status(StatusCodes.OK).json({
    message: "Review Updated successfully ",
    review,
  });
};
const deleteReview = async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id });
  if (!review) {
    throw new CustomError.NotFoundError("Review not found");
  }
  const user = await User.findById(req.user.userId);

  checkPermission(user, review.user);
  await review.remove();
  res.status(StatusCodes.OK).json({
    message: "Review deleted successfully ",
  });
};

const getSingleProductReviews = async (req, res) => {
  const reviews = await Review.find({ product: req.params.id }).populate({
    path: "user",
    select: "name",
  });
  if (!reviews) {
    throw new CustomError.BadRequestError("product not found");
  }

  res.status(StatusCodes.OK).json({
    message: "Product retrieved successfully ",
    reviews,
    count: reviews.length,
  });
};

module.exports = {
  createReview,
  getSingleReview,
  getAllReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
