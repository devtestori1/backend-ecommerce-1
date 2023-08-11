const {urlDB} = require("../config")
const mongoose = require("mongoose")
mongoose.connect(urlDB);

const db= mongoose.connection

module.exports = db