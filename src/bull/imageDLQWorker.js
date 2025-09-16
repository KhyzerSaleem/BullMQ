import { Worker } from "bullmq";
import redisConnection from "../config/redis.js";

const connection = {
  ...redisConnection,
  maxRetriesPerRequest: null,
};

const imageDLQWorker = new Worker(
  "imageDLQ",
  async (job) => {
    console.log("📥 Processing DLQ job:", job.data);
  },
  { connection }
);

export default imageDLQWorker;
