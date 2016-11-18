Requires

* apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev
* ffmpeg

Install with npm install -g dustinrue/destiny-medal-detector-express

Create a file and place the following in it:

* export XBLUSERNAME=<xbox live username>
* export XBLPASSWORD=<xbox live password>
* export PORT=3000

Start it with

source <envfile> && medaldetector-express 
