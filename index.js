var express = require('express');
var bodyParser = require('body-parser');
var medalDetector = require('destiny-medal-detector');
var request = require('request');
var fs = require('fs');
var tmp = require('tmp');
var URL = require('url');
var app = express();

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.post('/detectmedals', function(req, res) {
  var medals = req.body.medals
  var url = req.body.url;
  var parsedUrl = URL.parse(url);
  
  if (!parsedUrl.hostname.match(/gameclipscontent.+xboxlive.com/i)) {
    res.send("invalid clip url");
  }
  else {
    var tmpVideoFile = tmp.fileSync();
    var file = fs.createWriteStream(tmpVideoFile.name);
    request(url).pipe(file)

    file.on('finish', function() {
      console.log("Processing " + tmpVideoFile.name);
      medalDetector.detectMedals(tmpVideoFile.name, medals, function(medalsDetected) {
        res.send(medalsDetected);
        fs.unlink(tmpVideoFile.name);
      });
    });
  }
    
});

app.listen(3000, function() {
  console.log("Ready");
  
});
