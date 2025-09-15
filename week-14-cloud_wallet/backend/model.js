const mongoose = require("mongoose")
require("dotenv").config();
mongoose.connect(process.env.MONGODB_URL)

const UserSchema = mongoose.Schema({
	username: String,
	password: String,
	privateKey: String,
	publicKey: String,
})

const userModel = mongoose.model("users", UserSchema)

module.exports = {
	userModel
}