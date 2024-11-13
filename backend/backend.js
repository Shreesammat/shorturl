const express = require('express');
const { Url } = require('./db/connectdb');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('../frontend/dist'));


function isValidUrl(req,res,next) {
  let inputUrl = req.params.url;

  if(!/^https?:\/\//i.test(inputUrl)) {
    console.log('Adding protocol to input')
    inputUrl = 'http://' + inputUrl;
  }
  try {
    new URL(inputUrl);

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
    res.redirect('http://'+originalUrl);
  } else {
    res.status(500);
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
    res.send({shortUrl: `http://localhost:3000/${isExist.shortUrl}`})
    return;
  }
  
  const urltemp = new Url({originalUrl: url, shortUrl: result})
  await urltemp.save()
    .then(() => console.log('updated db'))
    .catch(() => console.log('db not updated'))
  const shortUrl = `http://localhost:3000/${result}`;
  res.send({shortUrl});
})

//hashing
function hasher(str) {
  let hashValue = 0;
    const prime = 31;  // A small prime number as base
    const mod = 1000000007;  // A large prime modulus to keep the hash value manageable

    for (let i = 0; i < str.length; i++) {
      hashValue = (hashValue * prime + str.charCodeAt(i)) % mod;
    }
    
    return hashValue.toString();
}


app.listen(port, () => {
  console.log(`server running completely fine on ${port}`)
})