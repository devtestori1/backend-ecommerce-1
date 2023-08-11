const midtransClient = require("midtrans-client");
const { midtrans_server_key, mode_midtrans } = require("../../config");
const snap = new midtransClient.Snap({
  isProduction: mode_midtrans === "production" ? true : false,
  serverKey: midtrans_server_key,
});
const Transaction = require("./model");
const Product = require("../products/model");
const CustomAPI = require("../../errors");
const { StatusCodes } = require("http-status-codes");

// SETIAP PEMBELIAN BERHASIL JANGAN LUPA UNTUK KURANGIN STOCK ITEM NYA, JANGAN LUPA
const createTokenPayment = async (req, res, next) => {
  try {
    console.log("test");

    const { order_id, gross_amount } = req.body;
    const { email, no_telpon, username } = req.user;
    console.log("here");

    if (!order_id || !gross_amount) {
      throw new CustomAPI.BadRequestError(
        "Order ID (transactionID) and Gross Amount (price) must include"
      );
    }
    const parameter = {
      transaction_details: {
        order_id: "test",
        gross_amount: "10000",
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        username,
        email,
        no_telpon,
      },
    };
console.log("test")

    const transaction = await snap.createTransaction(parameter);
    return res.status(StatusCodes.OK).json({
      message: "Success",
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

const getAllTransactions = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const result = await Transaction.find({ id_user: userId })
      .populate({
        path: "id_user",
        select: "username email no_telpon",
      })
      .populate({
        path: "id_product",
        // select : "name description purchase_price sell_price keypoint"
      });
    return res.status(StatusCodes.OK).json({
      message: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const getOneTransaction = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const result = await Transaction.findOne({ id_user: userId, _id: id })
      .populate({
        path: "id_user",
        select: "username email no_telpon",
      })
      .populate({
        path: "id_product",
        // select : "name description purchase_price sell_price keypoint"
      });
    return res.status(StatusCodes.OK).json({
      message: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
// CREATE TRANSACTION ITU KETIKA KITA CHECKOUT
const createTransaction = async (req, res, next) => {
  try {
    const { userId, email, no_telpon, username } = req.user;
    const { id_product, total_pcs } = req.body;
    const checkProduct = await Product.findOne({ _id: id_product });
    if (!checkProduct) {
      throw new CustomAPI.NotFoundError("Product Not Found");
    }
    if (checkProduct.stock - Number(total_pcs) <= 0) {
      throw new CustomAPI.BadRequestError("Stock Product Empty");
    }
    let totalPrice = Number(checkProduct.sell_price) * Number(total_pcs);
    const result = await Transaction.create({
      id_user: userId,
      id_product: id_product,
      total_price: totalPrice,
      total_pcs,
    });

    const parameter = {
      transaction_details: {
        order_id: result._id,
        gross_amount: result.total_price,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        username,
        email,
        no_telpon,
      },
    };
    const transaction = await snap.createTransaction(parameter);

    result.tokenPayment = transaction.token;
    await result.save();
    return res.json({
      message: "Success Create Transaction",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const makeTransactionFinished = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const result = await Transaction.findOne({ id_user: userId, _id: id });
    if (!result) {
      throw new CustomAPI.NotFoundError("Not Found Transacations");
    }
    result.isFinished = true;
    result.statusPayment = "success";
    const reducedProduct = await Product.findOne({ _id: result.id_product });
    if (!reducedProduct) {
      throw new CustomAPI.NotFoundError("Cannot find Product");
    }
    if (reducedProduct.stock <= 0) {
      throw new CustomAPI.BadRequestError("Stock is less than 1");
    }
    reducedProduct.stock = reducedProduct.stock - result.total_pcs;
    await reducedProduct.save();
    await result.save();
    return res.status(StatusCodes.OK).json({
      message: "Success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const makeTransactionDenied = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const result = await Transaction.findOne({ id_user: userId, _id: id });
    if (!result) {
      throw new CustomAPI.NotFoundError("Not Found Transacations");
    }
    if (!result.isFinished) {
      result.statusPayment = "denied";
    }

    await result.save();
    return res.status(StatusCodes.OK).json({
      message: "Success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTransaction = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const result = await Transaction.findOneAndDelete({
      id_user: userId,
      _id: id,
    });
    if (!result) {
      throw new CustomAPI.NotFoundError("Not Found Transacations");
    }

    return res.status(StatusCodes.OK).json({
      message: "Success Deleted",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTokenPayment,
  getAllTransactions,
  createTransaction,
  getOneTransaction,
  makeTransactionFinished,
  makeTransactionDenied,
  deleteTransaction,
};
