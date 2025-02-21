import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    isMfaActive: {
        type: Boolean,
        requried: false
    },
    twoFactorSecret: {
        type: String
    }

},
       
    {
        timestamps: true,
    }
);
const authuserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    isMfaActive: {
        type: Boolean,
        requried: false,
    },
    twoFactorSecret: {
        type: String
    }

},
       
    {
        timestamps: true,
    }
);


const User = mongoose.model("User", userSchema);
const AuthUser = mongoose.model("AuthUser", authuserSchema);
export {User, AuthUser}