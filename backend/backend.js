const express = require('express');
const { Url } = require('./db/connectdb');
const crypto = require('crypto');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('../frontend/dist'));


function isValidUrl(req,res,next) {
  let inputUrl = req.params.url;

  try {
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
  
    // Prepend 'http://' if the URL lacks a protocol
    if (!/^https?:\/\//i.test(inputUrl)) {
      url = 'http://' + inputUrl;
    }

    if(!urlPattern.test(inputUrl)) {
      throw new Error("Invalid URL format")
    }

    console.log(inputUrl, ' isvalidurl try block');
    req.validateUrl = inputUrl;
    next();
  } catch {
    console.log(inputUrl,'isValidUrl catch block');
    res.status(400).send("Invalid URL format");
  }
};


app.get("/",(req,res) => {
  res.render('index.html')
})


app.get("/:hash",async (req,res) => {
  console.log('randi')
  const {hash} = req.params;
  console.log(hash);

  const original = await Url.findOne({shortUrl: hash});
  console.log(original);
  const originalUrl = original.originalUrl;

  if(originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(500).send("Invalid URL");
  }
})


app.post("/shorten/:url",isValidUrl ,async (req,res) => {
  console.log('enetered shorten')
  const url= req.validateUrl;
  if(!url || typeof url !== 'string') {
    return res.status(400).send("Invalid URL");
  }
  const result = hasher(url);

  const isExist = await Url.findOne({originalUrl:url})
  console.log(isExist);

  if(isExist) {
    res.send({shortUrl: `https://shorturl-7tor.onrender.com/${isExist.shortUrl}`})
    return;
  }
  
  const urltemp = new Url({originalUrl: url, shortUrl: result})
  await urltemp.save()
    .then(() => console.log('updated db'))
    .catch(() => console.log('db not updated'))
  const shortUrl = `https://shorturl-7tor.onrender.com/${result}`;
  res.send({shortUrl});
})

//hashing
const base62chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Function to convert a number to Base62
function toBase62(num) {
  let base62 = '';
  while (num > 0) {
    base62 = base62chars[num % 62] + base62;
    num = Math.floor(num / 62);
  }
  return base62;
}

function hasher(url) {
  // Create an MD5 hash of the URL
  const hash = crypto.createHash('md5').update(url).digest('hex');

  // Convert a portion of the hash to a number and then to Base62
  const hashInt = parseInt(hash.slice(0, 8), 16); // Take the first 8 characters of the hash
  const base62String = toBase62(hashInt);

  // Return the first 7 characters of the Base62 string
  return base62String.slice(0, 7);
}

app.listen(port, () => {
  console.log(`server running completely fine on ${port}`)
})