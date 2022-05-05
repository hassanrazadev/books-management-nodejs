const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Full name is required."]
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: [true, "User with email {VALUE} already exists."],
        trim: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: '{VALUE} is not a valid email!'
        }
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        required: [true, "Please specify user role"]
    },
    password: {
        type: String,
        required: [true, "Password is required."],
        minLength: [8, "Password should be at least 8 characters long."],
        set: (value) => { bcrypt.hashSync(value) }
    },
    avatar: String,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);