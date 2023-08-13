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
} = require("./controller");

router.get("/", authenticateUser, authorizeRoles("admin"), getAllTransactions);
router.post("/create-token", authenticateUser, createTokenPayment);

router.post("/", authenticateUser, createTransaction);

router.get("/:id", authenticateUser, getOneTransaction);
router.put("/mark-finish/:id", authenticateUser, makeTransactionFinished);
router.put("/mark-denied/:id", authenticateUser, makeTransactionDenied);
router.delete(
  "/:id",
  authenticateUser,
  authorizeRoles("admin"),
  deleteTransaction
);

module.exports = router;
