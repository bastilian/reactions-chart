var path    = require('path');
var express = require('express');
var app     = express();

var Chart           = require('./lib/chart');
var GitHubReactions = require('./lib/github-resource');

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/chart/:user/:repo/:resource/:id', function (req, res) {
  res.header('Cache-Control', 'public, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');

  if (['issues', 'pull'].includes(req.params.resource)) {
    var url      = req.params.user + '/' + req.params.repo + '/issues/' + req.params.id;
    var resource = new GitHubReactions(url);
    var chart    = new Chart(resource.collectedReactions(), 200, 400);

    res.type('png');
    res.send(chart.png());
  } else {
    res.status(404);
    res.send('Not found');
  }
});

app.listen(process.env['PORT'], function () {
  console.log('Reactions charts listening on port ', process.env['PORT']);
});
