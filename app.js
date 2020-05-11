const express = require('express');
const app = express();
const request = require('request');
const bodyPaser = require('body-parser');
let id, 
path;

//middlewares
app.use(express.urlencoded({extended: false}));

//router
app.get('/', (req,res) => {
  res.sendFile(__dirname + '/index.html');
});

debugger;

app.post('/send', (req,res) => {
  path = req.body.url + '?__a=1';
  request(path, function (error, response, body) {
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    id = JSON.parse(body).graphql.shortcode_media.id;
    console.log(`Id= ${id}`);
    res.json({"Id":id});
  });
});

//starting server
app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

//URL de instagram a buscar https://www.instagram.com/p/B_h9fjDpPJf/