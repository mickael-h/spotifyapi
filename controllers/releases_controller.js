const request = require('request');

const CODE_OK = 200;

exports.releases = function (req, res, next) {
  const access_token = req.query.access_token || null;

  const options = {
    url: 'https://api.spotify.com/v1/browse/new-releases',
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
