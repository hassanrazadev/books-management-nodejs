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
        // unique: [true, "User with email {VALUE} already exists."],
        trim: true,
        validate: [
            { // check if email
                validator: function (v) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                },
                message: '{VALUE} is not a valid email!'
            }, { // check if email already exists
                validator: function (v) {
                    return !mongoose.models.User.countDocuments({email: v});
                },
                message: 'User with email {VALUE} already exists.'
            }
        ]
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        required: [true, "Please specify user role"]
    },
    password: {
        type: String,
        required: [true, "Password is required."],
        minLength: [8, "Password should be at least 8 characters long."]
    },
    avatar: String,
}, { timestamps: true });

// encrypt password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = bcrypt.hashSync(this.password, salt);
    } catch (e) {
        return next(e);
    }
});

module.exports = mongoose.model('User', userSchema);