const http = require('http');

function keepAlive() {
  http.createServer(function (req, res) {
    res.write("Ghost Net Bot is running!");
    res.end();
  }).listen(8080);
}

module.exports = keepAlive;
