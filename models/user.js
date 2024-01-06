const mongoose = require('mongoose');


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            trim: true,
            required: true,
        },
        is_deleted: {
            type: Boolean,
            default:false,
            trim: true,
        },
    }, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
}
);

const user = mongoose.model("User", userSchema);
module.exports = { user };