const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    id_user : {
        type : mongoose.Types.ObjectId,
        ref: "User",
        required : [true, "user id must included"]
    },
    id_product : {
        type : mongoose.Types.ObjectId,
        ref: "Product",
        required : [true, "product id must included"]
    },
    total_price : {
        type : Number,
        required : [true, "total price must included"]
    },
    purchase_price : {
        type : Number,
        required : [true, "purchase price must included"]
    },
    sell_price : {
        type : Number,
        required : [true, "purchase price must included"]
    },
    total_pcs : {
        type : Number,
        required : [true, "total items bought must included"]
    },
    tokenPayment : {
        type : String,
        default : ""
    },
    statusPayment : {
        type : String,
        default : "pending"
    },
    isFinished : {
        type : Boolean,
        default : false
    }
}, { timestamps: true });


module.exports = mongoose.model("Transaction", TransactionSchema)