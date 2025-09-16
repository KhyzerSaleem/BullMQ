import path from "path";
import Image from "../models/imageModel.js";
import imageQueue from "../bull/imageQueue.js";
import { error } from "console";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded (field: image)" });
    }

    const relativePath = `/uploads/original/${req.file.filename}`;
    const absolutePath = path.resolve(req.file.path);

    const doc = await Image.create({
      originalPath: relativePath,
      status: "pending",
    });

    const job = await imageQueue.add(
      "processImage",
      {
        imageId: doc._id.toString(),
        filePath: absolutePath,
      },
      {
        attempts: 3, 
        backoff: { type: "exponential", delay: 60_000 }, 
        removeOnComplete: 1000,
        removeOnFail: 1000,
      }
    );

    doc.jobId = job.id?.toString?.() ?? String(job.id);
    await doc.save();

    return res.status(201).json({
      message: "Image uploaded and queued for processing",
      jobId: job.id,
      image: doc,
    });
  } catch (err) {
    console.error("uploadImage error:", err);
    return res.status(500).json({ error: err.message });
  }
};
