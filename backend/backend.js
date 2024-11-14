const express = require('express');
const { Url } = require('./db/connectdb');
const crypto = require('crypto');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/dist'))); // Serve React build files

// URL validation middleware
function isValidUrl(req, res, next) {
  let inputUrl = req.params.url;

  try {
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;

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

// Serve React app for root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

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
app.post("/shorten/:url", isValidUrl, async (req, res) => {
  const url = req.validateUrl;
  const existingEntry = await Url.findOne({ originalUrl: url });

  if (existingEntry) {
    res.send({ shortUrl: `https://shorturl-7tor.onrender.com/${existingEntry.shortUrl}` });
    return;
  }

  const shortUrl = hasher(url);
  const newEntry = new Url({ originalUrl: url, shortUrl });
  
  try {
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
