var express = require('express');
var bodyParser = require('body-parser');
var medalDetector = require('destiny-medal-detector');
var request = require('request');
var xboxLive = require('xbox-live-api');
var fs = require('fs');
var tmp = require('tmp');
var URL = require('url');
var app = express();

xboxLive.username = process.env.XBLUSERNAME;
xboxLive.password = process.env.XBLPASSWORD
xboxLive.useragent = "Destiny Medal Detector"; 

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.post('/detectmedals', function(req, res) {
  var medals = req.body.medals
  var gt = req.body.gt
  var vid = req.body.vid;
  

  xboxLive.GetDetailsForClip(gt, '247546985', vid, function(json) {
    var tmpVideoFile = tmp.fileSync();
    var file = fs.createWriteStream(tmpVideoFile.name);
    var url = json.gameClipUris[0].uri;
    console.log("Downloading " + vid + " for " + gt);
    request(url).pipe(file);

    file.on('finish', function() {
      console.log("Processing " + vid + " for " + gt);
      medalDetector.detectMedals(tmpVideoFile.name, medals, function(medalsDetected) {
        res.send(medalsDetected);
        console.log("Detected " + medalsDetected.join(", "));
        fs.unlink(tmpVideoFile.name, function() {
          
        });
      });
    });
  
  });
});


app.listen(3000, function() {
  console.log("Destiny Medal Detector is ready");
  
});
