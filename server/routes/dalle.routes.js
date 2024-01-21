import express from "express";
import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const router = express.Router();

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// to call api and generate images
const openai = new OpenAIApi(config);

router.route("/").get((req, res) => {
  res.status(200).json({ message: "Hello from DALL.E Routes" });
});

// passing the prompt from frontend to server
router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    // Check if the expected properties are present
    if (response.data && response.data.data && response.data.data[0].b64_json) {
      const image = response.data.data[0].b64_json;
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
