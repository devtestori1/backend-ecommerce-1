const express = require("express");
const router = express.Router();

const { authenticateUser, authorizeRoles } = require("../../middleware/auth");
const {
  getAllTransactions,
  createTokenPayment,
  createTransaction,
  getOneTransaction,
  makeTransactionFinished,
  makeTransactionDenied,
  deleteTransaction,
  getAllTransactionsByUser,
  getOneTransactionByUser,
  deleteTransactionByUser,
  callbackTransaction,
  callbackTransactionFinish,
} = require("./controller");

router.get("/", authenticateUser, authorizeRoles("admin"), getAllTransactions);
router.get("/user", authenticateUser,  getAllTransactionsByUser);
router.post("/create-token", authenticateUser, createTokenPayment);

router.post("/payments/handling", callbackTransaction);
router.post("/payments/handling/finish", callbackTransactionFinish);

router.post("/", authenticateUser, createTransaction);

router.get("/:id", authenticateUser,authorizeRoles("admin"), getOneTransaction);
router.get("/user/:id", authenticateUser, getOneTransactionByUser);
router.put("/mark-finish/:id", authenticateUser, makeTransactionFinished);
router.put("/mark-denied/:id", authenticateUser, makeTransactionDenied);
router.delete(
  "/:id",
  authenticateUser,
  authorizeRoles("admin"),
  deleteTransaction
);
router.delete(
  "/user/:id",
  authenticateUser,
  deleteTransactionByUser
);

module.exports = router;
