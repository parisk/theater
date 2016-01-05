var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var files = fs.readdirSync(process.env.THEATER_DIR).filter(function (file) {
    var path = process.env.THEATER_DIR + '/' + file;
    if (file.match(/\.(md|markdown)$/i) && !fs.statSync(path).isDirectory()) {
      return true;
    }
    return false;
  });

  res.render('index', {
    title: 'Theater',
    files: files
  });
});

module.exports = router;
