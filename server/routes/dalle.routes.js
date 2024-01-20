import express from "express";
import * as dotenv from "dotenv";
import Configuration from "openai";
import OpenAI from "openai";

dotenv.config();

const router = express.Router();

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// to call api and generate images
const openai = new OpenAI(config);

router.route("/").get((req, res) => {
  res.status(200).json({ message: "Hello from DALL.E Routes" });
});

// passing the propmpt from frontend to server
router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    // Check if the expected properties are present
    if (response.data && response.data.data && response.data.data.length > 0) {
      const image = response.data.data[0].url;
      res.status(200).json({ photo: image });
    } else {
      // Handle unexpected response structure
      console.error("Unexpected response structure:", response);
      res.status(500).json({
        message: "Error! Unexpected response structure from OpenAI API.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error! Something went wrong." });
  }
});

export default router;
