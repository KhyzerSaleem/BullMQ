import { Queue } from "bullmq";
import redisConnection from "../config/redis.js";

const imageDLQ = new Queue("imageDLQ", {
  connection: redisConnection,
});

export default imageDLQ;
