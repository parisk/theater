var express = require('express');
var fm = require('front-matter');
var fs = require('fs');
var md = require('markdown-it')('commonmark');
var router = express.Router();

router.get(/^\/(.+)$/, function(req, res, next) {
  var path = process.env.THEATER_DIR + '/' + req.params[0];
  var renderedTemplate = md.render(fs.readFileSync(path).toString('utf-8'));
  res.render('preview', {
    title: req.params[0],
    template: renderedTemplate
  });
});

module.exports = router;
