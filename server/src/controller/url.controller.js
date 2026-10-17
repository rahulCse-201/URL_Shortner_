import Url from "../model/url.model.js";
import { nanoid } from "nanoid";

const createUrl = async (req, res) => {
  console.log("Request body:", req.body.url, req.body.customAlias);
  const { url, customAlias } = req.body;
  if (!url) {
    return res.status(400).json({ message: " URL is required" });
  }
  try {
    const originalUrl = typeof url === "string" ? url.trim() : "";

    if (!originalUrl) {
      return res.status(400).json({ message: "URL is required" });
    }
    let shortCode = customAlias ? customAlias : nanoid(8);
    const shortUrl = `${req.protocol}://${req.get("host")}/${shortCode}`;
    console.log("Short URL:", shortUrl);
    const createdUrl = await Url.create({
      originalUrl,
      shortCode,
    });

    if (!createdUrl) {
      return res
        .status(500)
        .json({ success: false, message: "Unable to create short URL" });
    }

    return res
      .status(200)
      .json({
        success: true,
        shortUrl,
        message: "Short URL created successfully",
      });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const redirection = async (req, res) => {
  console.log("hit the redirection");
  const { shortCode } = req.params;
  if (!shortCode) {
    return res.status(400).json({ message: "Short code is required" });
  }
  try {
    const url = await Url.findOne({ shortCode });
    if (!url) {
      return res
        .status(404)
        .json({ success: false, message: "Short URL not found" });
    }

    console.log("Redirecting to:", url.originalUrl);
    console.log("received url from db", url);
    return res.redirect(302, url.originalUrl);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export { createUrl, redirection };
