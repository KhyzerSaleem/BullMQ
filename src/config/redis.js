import { Redis } from "ioredis";

const redisConnection = new Redis({
  host: "127.0.0.1",
  port: 6379,
});

redisConnection.on("connect", () => {
  console.log("✅ Redis is Connected");
});

redisConnection.on("error", (err) => {
  console.log("❌ Redis connection error ", err);
});

export default redisConnection;
