
import mongoose from "mongoose";

const accountSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

});

export const Account = mongoose.model("Account", accountSchema);
