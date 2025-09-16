import { Queue } from "bullmq";
import redisConnection from "../config/redis.js";

const imageQueue = new Queue("imageQueue", {
  connection: redisConnection,
});

export default imageQueue;
