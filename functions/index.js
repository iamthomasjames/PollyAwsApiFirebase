const functions = require('firebase-functions');

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const app = express();
const admin = require('firebase-admin')

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const polly = new AWS.Polly({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-2',
});

app.post('/speech', async (req, res) => {
  const { text } = req.body;
  let params = {
    Text: text,
    OutputFormat: 'mp3',
    VoiceId: 'Brian',
  };
AWS.config.region = 'us-east-2'; 
var polly1 = new AWS.Polly({apiVersion: '2016-06-10'});
var signer = new AWS.Polly.Presigner(params, polly)
signer.getSynthesizeSpeechUrl(params, function(error, url) {
    if (error) {
        console.log(error)
        res.status(500).send(error);
    } else {
        res.status(200).send(url)
    }
  });
});

app.get('/hello',(req,res)=>{
    return res.send('Hello world');
})


exports.app=functions.https.onRequest(app);