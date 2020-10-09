const { CLIENT_ID, CLIENT_SECRET } = require('../secret');

const request = require('request');
const querystring = require('querystring');

const STATE_KEY = 'spotify_auth_state';
const REDIRECT_URI = 'http://4d01faa75409.ngrok.io/callback';
const APP_URL = 'preview-scheme://spotify-preview/callback';
const CODE_OK = 200;

exports.callback = function (req, res, next) {
  // your application requests refresh and access tokens
  // after checking the state parameter
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[STATE_KEY] : null;

  if (state === null || state !== storedState) {
    res.redirect(`/#${querystring.stringify({
      error: 'state_mismatch',
    })}`);
  } else {
    res.clearCookie(STATE_KEY);
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      },
      headers: {
        'Authorization':
          `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`)
            .toString('base64')}`,
      },
      json: true,
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === CODE_OK) {

        const { access_token, refresh_token } = body;

        const options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': `Bearer ${access_token}` },
          json: true,
        };

        // use the access token to access the Spotify Web API
        request.get(options, function (err, resp, r_body) {
          console.log(r_body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect(`/#${querystring.stringify({
          access_token,
          refresh_token,
        })}`);
      } else {
        res.redirect(`/#${querystring.stringify({
          error: 'invalid_token',
        })}`);
      }
    });
  }
};

const generateRandomString = length => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

exports.login = function (req, res, next) {
  const STATE_LN = 16;
  const state = generateRandomString(STATE_LN);
  res.cookie(STATE_KEY, state);

  // your application requests authorization
  const scope = 'user-read-private user-read-email';
  res.redirect(`https://accounts.spotify.com/authorize?${querystring.stringify({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope,
    redirect_uri: REDIRECT_URI,
    state,
  })}`);
};

exports.redirectToApp = function (req, res, next) {
  res.redirect(APP_URL);
};

exports.refreshToken = function (req, res, next) {
  // requesting access token from refresh token
  const refresh_token = req.query.refresh_token;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization':
        `Basic ${new Buffer(`${CLIENT_ID}:${CLIENT_SECRET}`)
          .toString('base64')}`,
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token,
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === CODE_OK) {
      const access_token = body.access_token;
      res.send({
        access_token,
      });
    }
  });
};
