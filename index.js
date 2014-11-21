var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var parse = require('csv-parse');
var _ = require('lodash');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendfile('index.html');
});

var dmas = [];

var devices = ['mobile', 'tablet', 'pc'];
var browsers = ['IE 9', 'IE 10', 'Firefox 21', 'Safari 6', 'WebKit', 'iOS 7', 'iOS 8'];

fs.readFile('public/data/dma.csv', 'utf8', function(err, data) {
  parse(data, {comment: '#'}, function(err, output) {
    output.forEach(function(dma, i) {
      dmas[i] = {
        'id': dma[1],
        'name': dma[0]
      };
    })
  })
})

io.on('connection', function(socket){
  setInterval(function() {
    var randomDma = dmas[_.random(0, dmas.length - 1)];
    var dmaId = null;
    var dmaName = null;
    var device = devices[_.random(0, devices.length - 1)]
    var browser = browsers[_.random(0, browsers.length - 1)]

    if (randomDma && randomDma.id) {
      dmaId = randomDma['id']
      dmaName = randomDma['name'];
    }

    var event =  dmaId + ':' + dmaName + ':' + device + ':' + browser;

    io.emit('event', event);
  }, 500);
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
