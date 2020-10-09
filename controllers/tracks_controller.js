const request = require('request');

const CODE_OK = 200;

exports.tracks = function (req, res, next) {
  const id = req.query.id || null;
  const access_token = req.query.access_token || null;

  const options = {
    url: `https://api.spotify.com/v1/albums/${id}/tracks`,
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
