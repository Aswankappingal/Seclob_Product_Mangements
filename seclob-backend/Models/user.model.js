const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: [] }]
}, { timestamps: true }); 

module.exports = mongoose.model("users", userSchema);
