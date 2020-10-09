const request = require('request');
const querystring = require('querystring');

const CODE_OK = 200;

exports.albums = function (req, res, next) {
  const id = req.query.id || null;
  const access_token = req.query.access_token || null;

  const options = {
    url: `https://api.spotify.com/v1/artists/${id}/albums?${querystring.stringify({
      include_groups: 'album',
    })}`,
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
