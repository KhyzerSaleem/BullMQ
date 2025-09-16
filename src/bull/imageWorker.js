import dotenv from "dotenv";
dotenv.config();

import { Worker } from "bullmq";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import redisConnection from "../config/redis.js";
import Image from "../models/imageModel.js";
import connectDB from "../config/connectDB.js";
import imageDLQ from "./imageDLQ.js";


await connectDB();

const connection = {
  ...redisConnection,
  maxRetriesPerRequest: null,
};

const processedDir = path.join(process.cwd(), "public/uploads/processed");
if (!fs.existsSync(processedDir)) {
  fs.mkdirSync(processedDir, { recursive: true });
}

const imageWorker = new Worker(
  "imageQueue",
  async (job) => {
    const { imageId, filePath } = job.data;
    console.log(`👷 Processing job ${job.id} for image ${imageId}`);

    await Image.findByIdAndUpdate(imageId, { status: "processing" });

    try {
      const fileName = path.basename(filePath);
      const baseName = fileName.split(".")[0];

      const thumbnailPath = path.join(processedDir, `${baseName}-thumb.jpg`);
      const mediumPath = path.join(processedDir, `${baseName}-medium.jpg`);
      const largePath = path.join(processedDir, `${baseName}-large.jpg`);

      await sharp(filePath).resize(150, 150).toFile(thumbnailPath);
      await sharp(filePath).resize(500, 500).toFile(mediumPath);
      await sharp(filePath).resize(1000, 1000).toFile(largePath);

      await Image.findByIdAndUpdate(imageId, {
        status: "complete",
        processedPath: {
          thumbnail: `/uploads/processed/${baseName}-thumb.jpg`,
          medium: `/uploads/processed/${baseName}-medium.jpg`,
          large: `/uploads/processed/${baseName}-large.jpg`,
        },
        jobId: job.id,
      });

      console.log(`✅ Job ${job.id} completed for image ${imageId}`);
      return { success: true };
    } catch (err) {
      console.log(`❌ Job ${job.id} failed for image ${imageId}: `, err);

      await Image.findByIdAndUpdate(imageId, {
        status: "failed",
        lastError: err.message,
        jobId: job.id,
      });


      throw err;
    }
  },
  { connection }
);

imageWorker.on("failed", async (job, err) => {
  console.log(`⚠️ Job ${job?.id} failed with error: ${err.message}`);
   await imageDLQ.add("failedImage", {
    imageId: job.data.imageId,
    filePath: job.data.filePath,
    error: err.message,
    originalJobId: job.id,
  });
});

imageWorker.on("completed", (job) => {
  console.log(`🎉 Job ${job.id} completed successfully`);
});

export default imageWorker;
