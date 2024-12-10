const mongoose = require('mongoose')
const env = require('dotenv').config;

const mongoUrl = 'mongodb+srv://streamdroid12:2qKSzrxQzFPFI5Y5@cluster0.qizs1.mongodb.net/mydb'

mongoose.connect(mongoUrl).then(() => console.log('connected successfully')).catch(e => console.log('error',e) );

const urlSchema = new mongoose.Schema({
  originalUrl: {type:String, required: true},
  shortUrl: {type: String, required: true}
});

const Url = mongoose.model('Url', urlSchema);

module.exports = {Url};