const express = require('express');
const app = express();
const request = require('request');
const path = require('path');

const recent = [];

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.get(['/search', '/search/:term'], (req, res) => {
  const term = req.params.term || 'cat';
  const offset = req.query.offset || 0;
  const url = `https://api.giphy.com/v1/gifs/search?api_key=${process.env.API_KEY}&q=${term}&limit=10&offset=${offset}&rating=G&lang=en`;
  request.get(url, (err, _, body) => {
    const data = JSON.parse(body).data;
    recent.unshift({term, when: new Date()});
    if(recent.length > 10) recent.pop();
    res.json(data.map(result => ({
      url: result.images.original.url,
      snippet: result.title,
      thumbnail: result.images.original_still.url,
      context: result.source
    })));    
  });
});

app.get('/recent', (req, res) => {
  res.json(recent);
});

app.listen('8080');