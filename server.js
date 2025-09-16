// server.js (root)
import express from "express";
import path from "path";
import { ExpressAdapter } from "@bull-board/express";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import imageQueue from "./src/bull/imageQueue.js";
import imageDLQ from "./src/bull/imageDLQ.js";
import imageRoutes from "./src/routes/imageRoutes.js";
import connectDB from "./src/config/connectDB.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullMQAdapter(imageQueue), new BullMQAdapter(imageDLQ)],
  serverAdapter,
});

// serve public folder (uploads will be accessible under /uploads/...)
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "public", "uploads"))
);

app.use("/admin/queues", serverAdapter.getRouter());

// mount API
app.use("/api/images", imageRoutes);

// connect to DB and start
const PORT = process.env.PORT || 5000;
(async () => {
  await connectDB();
  app.listen(PORT, () =>
    console.log(`Server listening on http://localhost:${PORT}`)
  );
})();
