import mongoose from "mongoose";

const linkSchema = new mongoose.Schema(
    {
        shortCode: {
            type: String,
            required: true,
            index: true
        },
        longLink: {
            type: String,
            required: true
        },
        clickCount: {
            type: Number,
            required: true,
            default: 0
        },
        qr: {
            type: String,   
            default: ''
        }
    },
    {
        timestamps: true
    }
)

const Link = mongoose.model("Link", linkSchema)
export default Link