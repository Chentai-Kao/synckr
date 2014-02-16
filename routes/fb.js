var FB = require('fb'),
    Step = require('step');

FB.options({
  appId:          process.env.FACEBOOK_APPID || "633324146737659",
  appSecret:      process.env.FACEBOOK_SECRET  || "bf135295b34333d56d5c41ea77328ffe",
  redirectUri:    process.env.FACEBOOK_REDIRECT_URI || "http://localhost:3000/callback"
});

exports.login = function(req, res) {
  var accessToken = req.session.access_token;
  if(!accessToken) {
    res.redirect(FB.getLoginUrl({ scope: 'email' }));
  } else {
    res.redirect('/');
  }
};

exports.loginCallback = function (req, res, next) {
  var code            = req.query.code;

  if(req.query.error) {
    // user might have disallowed the app
    return res.send('login-error ' + req.query.error_description);
  } else if(!code) {
    return res.redirect('/');
  }

  Step(
    function exchangeCodeForAccessToken() {
      FB.napi('oauth/access_token', {
        client_id:      FB.options('appId'),
        client_secret:  FB.options('appSecret'),
        redirect_uri:   FB.options('redirectUri'),
        code:           code
      }, this);
    },
    function extendAccessToken(err, result) {
      if(err) throw(err);
      FB.napi('oauth/access_token', {
        client_id:          FB.options('appId'),
        client_secret:      FB.options('appSecret'),
        grant_type:         'fb_exchange_token',
        fb_exchange_token:  result.access_token
      }, this);
    },
    function (err, result) {
      if(err) return next(err);

      req.session.access_token    = result.access_token;
      req.session.expires         = result.expires || 0;

      console.log(result);

      return res.redirect('/');
    }
  );
};

exports.logout = function (req, res) {
    req.session = null; // clear session
    res.redirect('/');
  };