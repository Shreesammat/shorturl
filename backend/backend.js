const express = require('express');
const { Url } = require('./db/connectdb');
const crypto = require('crypto');
const path = require('path');
const env = require('dotenv');
env.config();
const cors = require("cors")

const app = express();
const port = 3000;
const corsOptions = {
  origin: "*", // Allow only this origin
  methods: ["GET", "POST"], // Allow only specific HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
  credentials: true, // Allow cookies to be sent
};

app.use(cors(corsOptions));
app.use(express.json());

// URL validation middleware
function isValidUrl(req, res, next) {
  let inputUrl = req.body.inputUrl;
  console.log('middle inputUrl is', inputUrl)
  try {
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:[0-9]{1,5})?(\/[^\s]*)?(\?[^\s]*)?(#[^\s]*)?$/;


    // Prepend 'http://' if the URL lacks a protocol
    if (!/^https?:\/\//i.test(inputUrl)) {
      inputUrl = 'http://' + inputUrl;
    }

    if (!urlPattern.test(inputUrl)) {
      throw new Error("Invalid URL format");
    }

    console.log(inputUrl, 'is valid in try block');
    req.validateUrl = inputUrl;
    next();
  } catch (error) {
    console.log(inputUrl, 'is invalid in catch block');
    res.status(400).send("Invalid URL format");
  }
}

// Redirect endpoint
app.get("/:hash", async (req, res) => {
  const { hash } = req.params;
  const original = await Url.findOne({ shortUrl: hash });
  
  if (original && original.originalUrl) {
    res.redirect(original.originalUrl);
  } else {
    res.status(404).send("URL not found");
  }
});

// URL shortening endpoint
app.post("/shorten", isValidUrl, async (req, res) => {
  const url = req.validateUrl;
  console.log("url is ",url)
  // req.body = {inputUrl: inputUrl}
  const existingEntry = await Url.findOne({ originalUrl: url });
  console.log("existing enty  is ",existingEntry)
  console.log("here")
  if (existingEntry) {
    res.send({ shortUrl: `${process.env.HOST}/${existingEntry.shortUrl}` });
    return;
  }

  const encodedUrl = encodeURIComponent(url);
  const shortUrl = hasher(encodedUrl);
  console.log("shortUrl is : ", shortUrl)
  const newEntry = new Url({ originalUrl: url, shortUrl });
  console.log("made new entry")
  
  try {
    console.log('newEntry block')
    await newEntry.save();
    console.log('DB updated with new entry');
    res.send({ shortUrl: `https://shorturl-7tor.onrender.com/${shortUrl}` });
  } catch (error) {
    console.error('DB not updated', error);
    res.status(500).send("Internal Server Error");
  }
});

// Hashing function for URL shortening
const base62chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
function toBase62(num) {
  let base62 = '';
  while (num > 0) {
    base62 = base62chars[num % 62] + base62;
    num = Math.floor(num / 62);
  }
  return base62;
}

function hasher(url) {
  const hash = crypto.createHash('md5').update(url).digest('hex');
  const hashInt = parseInt(hash.slice(0, 8), 16);
  const base62String = toBase62(hashInt);
  return base62String.slice(0, 7);
}

app.listen(port, () => {
  console.log(`Server running completely fine on port ${port}`);
});