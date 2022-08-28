const Product = require("../model/Products");
const Review = require("../model/Review");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");
const path = require("path");

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res
    .status(StatusCodes.CREATED)
    .json({ message: "Product created successfully ", product });
};
const getSingleProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id });
  if (!product) {
    throw new CustomError.BadRequestError("product not found");
  }

  res.status(StatusCodes.OK).json({
    message: "Product retrieved successfully ",
    product,
  });
};

const getAllProduct = async (req, res) => {
  const products = await Product.find({});

  res.status(StatusCodes.OK).json({
    message: "Product retrieved successfully ",
    products,
    Count: products.length,
  });
};
const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new CustomError.BadRequestError("product not found");
  }

  res.status(StatusCodes.OK).json({
    message: "Product Updated successfully ",
    product,
  });
};
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new CustomError.BadRequestError("product not found");
  }
  await product.remove();

  res.status(StatusCodes.OK).json({
    message: "Product deleted successfully ",
  });
};
const uploadProductImage = async (req, res) => {
  const productImage = req.files.image;
  if (!req.files) {
    throw new CustomError.BadRequestError("image is required");
  }
  const maxSize = 1024 * 1024;
  if (maxSize < productImage.size) {
    throw new CustomError.BadRequestError(
      "File size too large, We accept file less than 2Mb"
    );
  }
  if (!productImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please upload an image");
  }

  const imagePath = path.join(
    __dirname,
    `../public/uploads/${productImage.name}`
  );
  res.status(StatusCodes.OK).json({
    message: "uploaded successfully ",
    imagePath,
  });
  await productImage.mv(imagePath);
};

module.exports = {
  createProduct,
  getSingleProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
};
