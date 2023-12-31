const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const notFoundMiddleware = require("./app/middleware/not-found")
const handleErrorMiddleware = require("./app/middleware/handler-error")
const usersRouter = require("./app/api/users/router")
const authRouter = require("./app/api/auth/router")
const productsRouter = require("./app/api/products/router")
const categoryRouter = require("./app/api/category/router")
const transactionRouter = require("./app/api/transactions/router")
const cors = require("cors")

const {authenticateUser} = require("./app/middleware/auth")



const app = express();
const prefix = '/api'

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", async (req,res,next) => {
    return res.send("hello world")
})

app.use(`${prefix}/users`,usersRouter)
app.use(`${prefix}/auth`, authRouter)
app.use(`${prefix}/products`, productsRouter)
app.use(`${prefix}/categories`, categoryRouter)
app.use(`${prefix}/transactions`, transactionRouter)
// middlewares
app.use(notFoundMiddleware);
app.use(handleErrorMiddleware);
module.exports = app;
