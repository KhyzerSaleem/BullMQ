import express from "express";
import { uploadSingleImage } from "../middlewares/multer.js";
import { uploadImage } from "../controllers/imageController.js";
import Image from "../models/imageModel.js";

const router = express.Router();


router.post("/upload", uploadSingleImage, uploadImage);


router.get("/status/:jobId", async (req, res) => {
  try {
    const doc = await Image.findOne({ jobId: req.params.jobId });
    if (!doc) return res.status(404).json({ error: "Job not found" });
    return res.json(doc);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
