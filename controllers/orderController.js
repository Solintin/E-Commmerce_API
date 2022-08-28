const Order = require("../model/Order");
const Product = require("../model/Products");
const User = require("../model/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");
const checkPermission = require("../Utils/checkPermission");

const createOrder = async (req, res) => {
  req.body.user = req.user.userId;

  const { tax, shippingFee, items: cartItems } = req.body;

  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError("No cart Item provided");
  }
  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError("Provide tax and shipping fees");
  }

  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findById(item.product);
    if (!dbProduct) {
      throw new CustomError.BadRequestError("Product not found");
    }
    const { name, price, image, _id } = dbProduct;
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id, //_id and item.product is quite dsame
    };
    orderItems = [...orderItems, singleOrderItem];
    subtotal += item.amount * price;
  }

  const total = tax + shippingFee + subtotal;

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    shippingFee,
    tax,
    clientSecret: "somthing",
    user: req.user.userId,
  });
  res
    .status(StatusCodes.CREATED)
    .json({ message: "Order created successfully ", order });
};
const getSingleOrder = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id });

  if (!order) {
    throw new CustomError.BadRequestError("Order not found");
  }
  const user = await User.findById(req.user.userId);

  checkPermission(user, order.user);
  res.status(StatusCodes.OK).json({
    message: "Order retrieved successfully ",
    order,
  });
};

const getAllOrder = async (req, res) => {
  const orders = await Order.find({});

  res.status(StatusCodes.OK).json({
    message: "Order retrieved successfully ",
    orders,
    Count: orders.length,
  });
};
const showAllMyOrders = async (req, res) => {
  const orders = await Order.findOne({ user: req.user.userId });

  res.status(StatusCodes.OK).json({
    message: "Order retrieved successfully ",
    orders,
    Count: orders.length,
  });
};
const updateOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new CustomError.BadRequestError("Order not found");
  }
  const user = await User.findById(req.user.userId);

  checkPermission(user, order.user);
  order.status = "paid";
  await order.save();
  res.status(StatusCodes.OK).json({
    message: "Order Updated successfully ",
    order,
  });
};
const deleteOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new CustomError.BadRequestError("Order not found");
  }
  await order.remove();

  res.status(StatusCodes.OK).json({
    message: "Order deleted successfully ",
  });
};

module.exports = {
  createOrder,
  getSingleOrder,
  getAllOrder,
  updateOrder,
  deleteOrder,
  showAllMyOrders,
};
