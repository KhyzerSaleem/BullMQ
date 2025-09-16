import { JobScheduler } from "bullmq";
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const imageSchema = new Schema(
  {
    originalPath: {
      type: String,
      required: true,
    },

    procesedPath: {
      thumbnail: String,
      medium: String,
      large: String,
    },

    status: {
      type: String,
      enum: ["pending", "processing", "complete", "failed"],
      default: "pending",
    },

    jobId: {
      type: String,
    },

    lastError: {
      type: String,
    },
  },
  { timestamps: true }
);

const Image = mongoose.model("Image", imageSchema);

export default Image;
