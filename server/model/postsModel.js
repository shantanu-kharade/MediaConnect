import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        media: {
            type: String,
            required: true,
        },
        caption: {
            type: String,
            default: "",
        },
        likeCount: {
            type: Number,
            default: 0,
        },
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Post", postSchema);
