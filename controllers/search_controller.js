const request = require('request');
const querystring = require('querystring');

const CODE_OK = 200;

exports.search = function (req, res, next) {
  const q = req.query.q || null;
  const type = req.query.type || null;
  const access_token = req.query.access_token || null;

  const options = {
    url: `https://api.spotify.com/v1/search?${querystring.stringify({ q, type })}`,
    headers: { 'Authorization': `Bearer ${access_token}` },
    json: true,
  };

  request.get(options, function (err, resp, result) {
    if (!err && resp.statusCode === CODE_OK) {
      res.send({ result });
    } else {
      res.send({ err, resp });
    }
  });
};
